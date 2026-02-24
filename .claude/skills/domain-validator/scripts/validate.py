#!/usr/bin/env python3
"""
domain-validator: 도메인 YAML 파일의 무결성을 검증한다.

사용법:
  python3 validate.py specs/domains/              # 디렉토리 내 모든 .yaml
  python3 validate.py specs/domains/auth.yaml     # 단일 파일
  python3 validate.py specs/domains/ specs/overview.yaml  # overview 포함 검증

검증 항목:
  - YAML 파싱 가능 여부
  - 필수 섹션 존재 (entities 또는 relationships)
  - 속성 타입이 허용 목록에 있는지
  - 관계의 from/to가 존재하는 엔티티를 참조하는지
  - 관계 타입이 허용 목록에 있는지
  - 카디널리티가 허용 형식인지
  - on_delete가 허용값인지
  - status가 허용값인지
  - 고아 엔티티 경고 (어떤 관계에도 참여하지 않는 엔티티)
  - TBD 항목 수 요약
  - 제약 조건 패턴 검증
"""

import yaml
import sys
import os
import re
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Dict, Set, Optional

# === 컨벤션 기반 허용 목록 ===

ALLOWED_STATUSES = {"confirmed", "TBD", "exploring", "deferred", "deprecated"}

ALLOWED_PROP_TYPES = {"string", "integer", "number", "boolean", "datetime", "enum", "hashed"}

ALLOWED_REL_TYPES = {"has", "contains", "creates", "triggers", "belongs_to", "references", "requires", "depends_on"}

ALLOWED_CARDINALITIES = {"1:1", "1:N", "N:1", "N:M"}

ALLOWED_ON_DELETE = {"cascade", "restrict", "set_null"}

# 제약 조건 패턴 (함수형 패턴)
RULE_PATTERNS = {
    "unique": r"^unique\(.+\)$",
    "range": r"^range\(.+,\s*.+,\s*.+\)$",
    "min": r"^min\(.+,\s*.+\)$",
    "max": r"^max\(.+,\s*.+\)$",
    "length": r"^length\(.+,\s*.+,\s*.+\)$",
    "required": r"^required\(.+\)$",
    "requires": r"^requires\(.+\)$",
    "in": r"^in\(.+,\s*.+\)$",
    "immutable": r"^immutable(\(.+\))?$",
    "limit": r"^limit\(.+,\s*.+,\s*.+\)$",
}

# 워크플로우 step type 허용값
ALLOWED_STEP_TYPES = {"event", "action", "decision", "parallel", "wait", "retry", "end"}

ALLOWED_FAILURE_STRATEGIES = {"retry", "skip", "abort", "notify"}

ALLOWED_TOUCH_ACTIONS = {"read", "create", "update", "delete"}


@dataclass
class Issue:
    severity: str  # critical, warning, info
    file: str
    message: str

    def __str__(self):
        icons = {"critical": "❌", "warning": "⚠️", "info": "ℹ️"}
        return f"  {icons.get(self.severity, '?')} [{self.severity}] {self.message}"


@dataclass
class ValidationResult:
    issues: List[Issue] = field(default_factory=list)
    tbd_count: int = 0
    entity_count: int = 0
    relationship_count: int = 0

    def add(self, severity: str, file: str, message: str):
        self.issues.append(Issue(severity, file, message))

    @property
    def critical_count(self):
        return sum(1 for i in self.issues if i.severity == "critical")

    @property
    def warning_count(self):
        return sum(1 for i in self.issues if i.severity == "warning")


def parse_prop_type(type_str: str) -> str:
    """enum(OrderStatus) -> enum, string -> string"""
    if isinstance(type_str, str) and type_str.startswith("enum("):
        return "enum"
    return str(type_str)


def is_known_rule_pattern(rule: str) -> bool:
    """제약 조건이 알려진 패턴인지 확인"""
    for pattern in RULE_PATTERNS.values():
        if re.match(pattern, rule):
            return True
    return False


def count_tbd_in_value(value, path: str = "") -> List[str]:
    """값에서 TBD, ???, exploring 항목을 재귀적으로 탐지"""
    found = []
    if isinstance(value, dict):
        status = value.get("status", "")
        if status in ("TBD", "exploring"):
            found.append(f"{path} (status: {status})")
        for k, v in value.items():
            found.extend(count_tbd_in_value(v, f"{path}.{k}"))
    elif isinstance(value, list):
        for i, item in enumerate(value):
            found.extend(count_tbd_in_value(item, f"{path}[{i}]"))
    elif isinstance(value, str) and value == "???":
        found.append(f"{path} (value: ???)")
    return found


def validate_domain_file(filepath: str, all_entities: Dict[str, Set[str]], result: ValidationResult):
    """단일 도메인 YAML 파일을 검증"""
    filename = os.path.basename(filepath)

    try:
        with open(filepath) as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as e:
        result.add("critical", filename, f"YAML 파싱 실패: {e}")
        return
    except Exception as e:
        result.add("critical", filename, f"파일 읽기 실패: {e}")
        return

    if not data:
        result.add("warning", filename, "파일이 비어 있음")
        return

    if not isinstance(data, dict):
        result.add("critical", filename, "최상위 구조가 dict가 아님")
        return

    entities = data.get("entities", {})
    relationships = data.get("relationships", [])
    enums = data.get("enums", {})

    if not entities and not relationships:
        # 워크플로우 파일일 수 있으므로 warning
        if "steps" in data or "trigger" in data:
            validate_workflow_file(filepath, data, all_entities, result)
            return
        result.add("warning", filename, "entities도 relationships도 없음")

    # === 엔티티 검증 ===
    local_entities = set()
    if isinstance(entities, dict):
        for name, entity in entities.items():
            local_entities.add(name)
            result.entity_count += 1

            if not isinstance(entity, dict):
                result.add("warning", filename, f"엔티티 '{name}'의 값이 dict가 아님")
                continue

            # status 검증
            status = entity.get("status", "confirmed")
            if isinstance(status, str) and status not in ALLOWED_STATUSES:
                result.add("warning", filename, f"엔티티 '{name}'의 status '{status}'가 허용 목록에 없음")

            # props 검증
            props = entity.get("props", {})
            if isinstance(props, dict):
                for prop_name, prop_type in props.items():
                    if isinstance(prop_type, dict):
                        # TBD 속성
                        prop_type_str = prop_type.get("type", "")
                    else:
                        prop_type_str = str(prop_type)

                    base_type = parse_prop_type(prop_type_str)
                    if base_type and base_type != "???" and base_type not in ALLOWED_PROP_TYPES:
                        result.add("warning", filename,
                                   f"엔티티 '{name}'.props.{prop_name}의 타입 '{prop_type_str}'가 허용 목록에 없음")

                    # enum 참조 검증
                    if prop_type_str.startswith("enum(") and prop_type_str.endswith(")"):
                        enum_name = prop_type_str[5:-1]
                        if enums and enum_name not in enums:
                            result.add("warning", filename,
                                       f"엔티티 '{name}'.props.{prop_name}이 참조하는 enum '{enum_name}'이 enums 섹션에 없음")

            # rules 검증
            rules = entity.get("rules", [])
            if isinstance(rules, list):
                for rule in rules:
                    if isinstance(rule, str) and not is_known_rule_pattern(rule):
                        # 자연어 규칙인지 확인 (한글 포함 또는 공백 포함이면 자연어로 간주)
                        if not re.search(r'[가-힣]', rule) and ' ' not in rule:
                            result.add("info", filename,
                                       f"엔티티 '{name}'의 rule '{rule}'이 알려진 패턴이 아님 (자연어이면 무시)")

            # TBD 탐지
            tbd_items = count_tbd_in_value(entity, name)
            result.tbd_count += len(tbd_items)

    all_entities[filename] = local_entities

    # === Enum 검증 ===
    if isinstance(enums, dict):
        for enum_name, enum_def in enums.items():
            if not isinstance(enum_def, dict):
                result.add("warning", filename, f"enum '{enum_name}'의 값이 dict가 아님")
                continue
            values = enum_def.get("values", [])
            if not values:
                result.add("warning", filename, f"enum '{enum_name}'에 values가 없음")
            default = enum_def.get("default")
            if default and isinstance(values, list) and default not in values:
                result.add("warning", filename,
                           f"enum '{enum_name}'의 default '{default}'가 values에 없음")
            transitions = enum_def.get("transitions", {})
            if isinstance(transitions, dict) and isinstance(values, list):
                for from_state, to_states in transitions.items():
                    if from_state not in values:
                        result.add("warning", filename,
                                   f"enum '{enum_name}'의 transition 출발 상태 '{from_state}'가 values에 없음")
                    if isinstance(to_states, list):
                        for to_state in to_states:
                            if to_state not in values:
                                result.add("warning", filename,
                                           f"enum '{enum_name}'의 transition 도착 상태 '{to_state}'가 values에 없음")

    # === 관계 검증 ===
    if isinstance(relationships, list):
        for i, rel in enumerate(relationships):
            if not isinstance(rel, dict):
                result.add("warning", filename, f"relationships[{i}]가 dict가 아님")
                continue

            result.relationship_count += 1
            rel_from = rel.get("from", "")
            rel_to = rel.get("to", "")
            rel_type = rel.get("type", "")
            rel_card = rel.get("card", "")
            rel_on_delete = rel.get("on_delete")
            rel_status = rel.get("status", "confirmed")

            # from/to 존재 확인 (현재 파일 내에서)
            if rel_from and rel_from not in local_entities:
                result.add("critical", filename,
                           f"관계[{i}]의 from '{rel_from}'이 이 파일의 entities에 없음")

            if rel_to and rel_to not in local_entities:
                # 다른 도메인의 엔티티일 수 있으므로 warning
                result.add("warning", filename,
                           f"관계[{i}]의 to '{rel_to}'가 이 파일의 entities에 없음 (다른 도메인이면 무시)")

            # 관계 타입 검증
            if rel_type and rel_type not in ALLOWED_REL_TYPES:
                result.add("critical", filename,
                           f"관계[{i}]의 type '{rel_type}'이 허용 목록에 없음. "
                           f"허용: {', '.join(sorted(ALLOWED_REL_TYPES))}")

            # 카디널리티 검증
            if rel_card and rel_card not in ALLOWED_CARDINALITIES:
                result.add("critical", filename,
                           f"관계[{i}]의 card '{rel_card}'가 허용 형식이 아님. "
                           f"허용: {', '.join(sorted(ALLOWED_CARDINALITIES))}")

            # on_delete 검증
            if rel_on_delete and rel_on_delete not in ALLOWED_ON_DELETE:
                result.add("warning", filename,
                           f"관계[{i}]의 on_delete '{rel_on_delete}'가 허용 목록에 없음. "
                           f"허용: {', '.join(sorted(ALLOWED_ON_DELETE))}")

            # status 검증
            if rel_status not in ALLOWED_STATUSES:
                result.add("warning", filename,
                           f"관계[{i}]의 status '{rel_status}'가 허용 목록에 없음")

            # TBD 탐지
            tbd_items = count_tbd_in_value(rel, f"relationships[{i}]")
            result.tbd_count += len(tbd_items)

    # === 고아 엔티티 감지 ===
    if local_entities and isinstance(relationships, list) and relationships:
        referenced = set()
        for rel in relationships:
            if isinstance(rel, dict):
                referenced.add(rel.get("from", ""))
                referenced.add(rel.get("to", ""))
        orphans = local_entities - referenced
        for orphan in orphans:
            result.add("info", filename, f"고아 엔티티: '{orphan}'이 어떤 관계에도 참여하지 않음")


def validate_workflow_file(filepath: str, data: dict, all_entities: Dict[str, Set[str]], result: ValidationResult):
    """워크플로우 YAML 파일을 검증"""
    filename = os.path.basename(filepath) if isinstance(filepath, str) else filepath

    steps = data.get("steps", {})
    if not isinstance(steps, dict):
        result.add("warning", filename, "steps가 dict가 아님")
        return

    step_names = set(steps.keys())

    for name, step in steps.items():
        if not isinstance(step, dict):
            result.add("warning", filename, f"step '{name}'의 값이 dict가 아님")
            continue

        step_type = step.get("type", "")

        # type 검증
        if step_type and step_type not in ALLOWED_STEP_TYPES:
            result.add("critical", filename,
                       f"step '{name}'의 type '{step_type}'이 허용 목록에 없음. "
                       f"허용: {', '.join(sorted(ALLOWED_STEP_TYPES))}")

        # next 참조 검증
        next_step = step.get("next")
        if next_step:
            if isinstance(next_step, str) and next_step not in step_names:
                result.add("critical", filename,
                           f"step '{name}'의 next '{next_step}'이 steps에 없음")
            elif isinstance(next_step, list):
                for ns in next_step:
                    if ns not in step_names:
                        result.add("critical", filename,
                                   f"step '{name}'의 next '{ns}'이 steps에 없음")

        # decision 분기 참조 검증
        if step_type == "decision":
            for field_name in ("if_yes", "if_no", "default"):
                target = step.get(field_name)
                if target and target not in step_names:
                    result.add("critical", filename,
                               f"step '{name}'의 {field_name} '{target}'이 steps에 없음")
            cases = step.get("cases", [])
            if isinstance(cases, list):
                for i, case in enumerate(cases):
                    if isinstance(case, dict):
                        case_next = case.get("next", "")
                        if case_next and case_next not in step_names:
                            result.add("critical", filename,
                                       f"step '{name}'.cases[{i}]의 next '{case_next}'이 steps에 없음")

        # retry target 참조 검증
        if step_type == "retry":
            target = step.get("target", "")
            if target and target not in step_names:
                result.add("critical", filename,
                           f"step '{name}'의 target '{target}'이 steps에 없음")
            on_exhaust = step.get("on_exhaust", "")
            if on_exhaust and on_exhaust not in step_names:
                result.add("critical", filename,
                           f"step '{name}'의 on_exhaust '{on_exhaust}'이 steps에 없음")

        # on_failure 검증
        on_failure = step.get("on_failure", {})
        if isinstance(on_failure, dict):
            strategy = on_failure.get("strategy", "")
            if strategy and strategy not in ALLOWED_FAILURE_STRATEGIES:
                result.add("warning", filename,
                           f"step '{name}'의 on_failure.strategy '{strategy}'가 허용 목록에 없음")
            fail_next = on_failure.get("next", "")
            if fail_next and fail_next not in step_names:
                result.add("critical", filename,
                           f"step '{name}'의 on_failure.next '{fail_next}'이 steps에 없음")

        # touches 검증
        touches = step.get("touches", [])
        if isinstance(touches, list):
            for j, touch in enumerate(touches):
                if isinstance(touch, dict):
                    action = touch.get("action", "")
                    if action and action not in ALLOWED_TOUCH_ACTIONS:
                        result.add("warning", filename,
                                   f"step '{name}'.touches[{j}]의 action '{action}'이 허용 목록에 없음")

        # TBD 탐지
        tbd_items = count_tbd_in_value(step, name)
        result.tbd_count += len(tbd_items)

    # end step 존재 확인
    has_end = any(
        isinstance(s, dict) and s.get("type") == "end"
        for s in steps.values()
    )
    if not has_end:
        result.add("info", filename, "type: end인 step이 없음")


def validate_overview_file(filepath: str, all_entities: Dict[str, Set[str]], result: ValidationResult):
    """overview.yaml을 검증"""
    filename = os.path.basename(filepath)

    try:
        with open(filepath) as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as e:
        result.add("critical", filename, f"YAML 파싱 실패: {e}")
        return

    if not data or not isinstance(data, dict):
        result.add("warning", filename, "파일이 비어 있거나 dict가 아님")
        return

    domains = data.get("domains", [])
    connections = data.get("domain_connections", [])

    # 도메인 검증
    domain_names = set()
    if isinstance(domains, list):
        for i, domain in enumerate(domains):
            if not isinstance(domain, dict):
                continue
            name = domain.get("name", "")
            domain_names.add(name)
            status = domain.get("status", "confirmed")
            if status not in ALLOWED_STATUSES:
                result.add("warning", filename,
                           f"domain '{name}'의 status '{status}'가 허용 목록에 없음")

    # domain_connections 검증
    if isinstance(connections, list):
        for i, conn in enumerate(connections):
            if not isinstance(conn, dict):
                continue
            rel = conn.get("rel", "")
            if rel and rel not in ALLOWED_REL_TYPES:
                result.add("critical", filename,
                           f"domain_connections[{i}]의 rel '{rel}'이 허용 목록에 없음. "
                           f"허용: {', '.join(sorted(ALLOWED_REL_TYPES))}")

    # TBD 탐지
    tbd_items = count_tbd_in_value(data, "overview")
    result.tbd_count += len(tbd_items)


def print_result(result: ValidationResult, files_checked: int):
    """검증 결과 출력"""
    print(f"\n{'='*60}")
    print(f"검증 완료: {files_checked}개 파일")
    print(f"  엔티티: {result.entity_count}개")
    print(f"  관계: {result.relationship_count}개")
    print(f"  TBD 항목: {result.tbd_count}개")
    print(f"{'='*60}")

    if not result.issues:
        print("\n✅ 이슈 없음")
        return 0

    # 심각도별 분류
    criticals = [i for i in result.issues if i.severity == "critical"]
    warnings = [i for i in result.issues if i.severity == "warning"]
    infos = [i for i in result.issues if i.severity == "info"]

    if criticals:
        print(f"\n❌ Critical ({len(criticals)}건):")
        for issue in criticals:
            print(f"  [{issue.file}] {issue.message}")

    if warnings:
        print(f"\n⚠️  Warning ({len(warnings)}건):")
        for issue in warnings:
            print(f"  [{issue.file}] {issue.message}")

    if infos:
        print(f"\nℹ️  Info ({len(infos)}건):")
        for issue in infos:
            print(f"  [{issue.file}] {issue.message}")

    print(f"\n요약: ❌ {len(criticals)} / ⚠️  {len(warnings)} / ℹ️  {len(infos)}")
    return 1 if criticals else 0


def main():
    if len(sys.argv) < 2:
        print("사용법: python3 validate.py <경로> [<경로> ...]")
        print("  경로: .yaml 파일 또는 디렉토리")
        sys.exit(1)

    result = ValidationResult()
    all_entities: Dict[str, Set[str]] = {}
    files_checked = 0

    for path_arg in sys.argv[1:]:
        path = Path(path_arg)

        if path.is_dir():
            yaml_files = sorted(path.glob("**/*.yaml"))
            for yaml_file in yaml_files:
                files_checked += 1
                str_path = str(yaml_file)
                if "overview" in yaml_file.name:
                    validate_overview_file(str_path, all_entities, result)
                else:
                    validate_domain_file(str_path, all_entities, result)
        elif path.is_file():
            files_checked += 1
            str_path = str(path)
            if "overview" in path.name:
                validate_overview_file(str_path, all_entities, result)
            else:
                validate_domain_file(str_path, all_entities, result)
        else:
            result.add("critical", path_arg, f"경로를 찾을 수 없음: {path_arg}")

    exit_code = print_result(result, files_checked)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()