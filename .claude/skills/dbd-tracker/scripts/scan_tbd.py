#!/usr/bin/env python3
"""
tbd-tracker: 프로젝트의 미정(TBD) 사항을 추적하고 현황을 보여준다.

사용법:
  python3 scan_tbd.py specs/                   # specs 전체 스캔
  python3 scan_tbd.py specs/domains/            # 도메인만 스캔
  python3 scan_tbd.py specs/ --format brief     # 요약만
  python3 scan_tbd.py specs/ --overdue-only     # 기한 지난 것만

스캔 대상:
  - .yaml 파일에서 status: TBD, exploring, deferred, ???
  - .feature 파일에서 @TBD, @decision-needed 태그
"""

import yaml
import sys
import os
import re
import argparse
from pathlib import Path
from datetime import datetime, date
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class TBDItem:
    file: str
    path: str           # YAML 내 경로 (e.g., "entities.Review.rating")
    status: str          # TBD, exploring, deferred, ???
    note: str = ""
    candidates: List[str] = field(default_factory=list)
    decision_by: str = ""

    @property
    def is_overdue(self) -> bool:
        if not self.decision_by:
            return False
        try:
            deadline = datetime.strptime(self.decision_by, "%Y-%m-%d").date()
            return date.today() > deadline
        except ValueError:
            return False  # 날짜가 아닌 조건 (e.g., "MVP 이후")

    @property
    def sort_key(self):
        """기한이 있는 것 → 기한순, 없는 것 → 뒤로"""
        if not self.decision_by:
            return "9999-99-99"
        try:
            datetime.strptime(self.decision_by, "%Y-%m-%d")
            return self.decision_by
        except ValueError:
            return "9998-99-99"  # 조건부 기한은 뒤에서 두 번째


def scan_yaml_value(value, path: str, file: str) -> List[TBDItem]:
    """YAML 값에서 재귀적으로 TBD 항목을 탐지"""
    items = []

    if isinstance(value, dict):
        status = value.get("status", "")
        if status in ("TBD", "exploring", "deferred"):
            items.append(TBDItem(
                file=file,
                path=path,
                status=status,
                note=value.get("note", ""),
                candidates=value.get("candidates", []),
                decision_by=str(value.get("decision_by", "")),
            ))
        # 재귀
        for k, v in value.items():
            if k in ("status", "note", "candidates", "decision_by"):
                continue
            items.extend(scan_yaml_value(v, f"{path}.{k}" if path else k, file))

    elif isinstance(value, list):
        for i, item in enumerate(value):
            items.extend(scan_yaml_value(item, f"{path}[{i}]", file))

    elif isinstance(value, str) and value == "???":
        items.append(TBDItem(
            file=file,
            path=path,
            status="???",
        ))

    return items


def scan_yaml_file(filepath: str) -> List[TBDItem]:
    """YAML 파일에서 TBD 항목을 스캔"""
    try:
        with open(filepath) as f:
            data = yaml.safe_load(f)
    except Exception:
        return []

    if not data:
        return []

    filename = os.path.relpath(filepath)
    return scan_yaml_value(data, "", filename)


def scan_feature_file(filepath: str) -> List[TBDItem]:
    """Gherkin .feature 파일에서 @TBD 시나리오를 스캔"""
    items = []
    filename = os.path.relpath(filepath)

    try:
        with open(filepath, encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return []

    # @TBD 또는 @decision-needed 태그가 있는 시나리오 찾기
    pattern = r'(@TBD|@decision-needed)\s*\n\s*Scenario:\s*(.+)'
    for match in re.finditer(pattern, content):
        tag = match.group(1)
        scenario_name = match.group(2).strip()

        # 후보군과 기한 찾기 (시나리오 아래 주석)
        after = content[match.end():]
        candidates = []
        decision_by = ""
        note = ""

        for line in after.split("\n"):
            line = line.strip()
            if line.startswith("# 후보") or line.startswith("# 옵션"):
                candidates.append(line.lstrip("# ").strip())
            elif line.startswith("# 결정 기한:") or line.startswith("# decision_by:"):
                decision_by = line.split(":", 1)[1].strip()
            elif line.startswith("# note:") or line.startswith("# 참고:"):
                note = line.split(":", 1)[1].strip()
            elif line.startswith("Given") or line.startswith("When") or line.startswith("Scenario"):
                break

        items.append(TBDItem(
            file=filename,
            path=f"Scenario: {scenario_name}",
            status="TBD" if tag == "@TBD" else "decision-needed",
            note=note,
            candidates=candidates,
            decision_by=decision_by,
        ))

    return items


def scan_directory(dir_path: str) -> List[TBDItem]:
    """디렉토리 전체를 스캔"""
    items = []
    path = Path(dir_path)

    for yaml_file in sorted(path.glob("**/*.yaml")):
        items.extend(scan_yaml_file(str(yaml_file)))

    for feature_file in sorted(path.glob("**/*.feature")):
        items.extend(scan_feature_file(str(feature_file)))

    return items


def print_full(items: List[TBDItem]):
    """상세 출력"""
    if not items:
        print("✅ TBD 항목 없음")
        return

    sorted_items = sorted(items, key=lambda x: x.sort_key)

    # 기한 지난 항목
    overdue = [i for i in sorted_items if i.is_overdue]
    if overdue:
        print(f"\n🚨 기한 지난 항목 ({len(overdue)}건):")
        print("-" * 60)
        for item in overdue:
            print_item(item, highlight=True)

    # 나머지
    not_overdue = [i for i in sorted_items if not i.is_overdue]
    if not_overdue:
        print(f"\n📋 미정 항목 ({len(not_overdue)}건):")
        print("-" * 60)
        for item in not_overdue:
            print_item(item)

    # 파일별 요약
    print(f"\n{'='*60}")
    print("파일별 요약:")
    file_counts = {}
    for item in items:
        file_counts[item.file] = file_counts.get(item.file, 0) + 1
    for file, count in sorted(file_counts.items()):
        print(f"  {file}: {count}건")
    print(f"\n전체: {len(items)}건 (기한 초과: {len(overdue)}건)")


def print_item(item: TBDItem, highlight: bool = False):
    """단일 TBD 항목 출력"""
    icon = {"TBD": "❓", "exploring": "🔍", "deferred": "⏸️", "???": "❔", "decision-needed": "❓"}
    prefix = "⚠️ " if highlight else ""

    print(f"\n  {prefix}{icon.get(item.status, '?')} [{item.status}] {item.path}")
    print(f"     파일: {item.file}")
    if item.note:
        print(f"     참고: {item.note}")
    if item.candidates:
        print(f"     후보: {', '.join(item.candidates)}")
    if item.decision_by:
        overdue_str = " ← 기한 초과!" if item.is_overdue else ""
        print(f"     기한: {item.decision_by}{overdue_str}")


def print_brief(items: List[TBDItem]):
    """요약 출력"""
    if not items:
        print("✅ TBD 항목 없음")
        return

    overdue = sum(1 for i in items if i.is_overdue)
    by_status = {}
    for item in items:
        by_status[item.status] = by_status.get(item.status, 0) + 1

    print(f"TBD 현황: 총 {len(items)}건", end="")
    if overdue:
        print(f" (🚨 기한 초과 {overdue}건)", end="")
    print()

    for status, count in sorted(by_status.items()):
        icon = {"TBD": "❓", "exploring": "🔍", "deferred": "⏸️", "???": "❔", "decision-needed": "❓"}
        print(f"  {icon.get(status, '?')} {status}: {count}건")


def main():
    parser = argparse.ArgumentParser(description="TBD 현황 추적")
    parser.add_argument("path", help="스캔할 디렉토리 또는 파일 경로")
    parser.add_argument("--format", choices=["full", "brief"], default="full",
                        help="출력 형식 (기본: full)")
    parser.add_argument("--overdue-only", action="store_true",
                        help="기한 지난 항목만 표시")
    args = parser.parse_args()

    path = Path(args.path)
    if path.is_dir():
        items = scan_directory(str(path))
    elif path.is_file():
        if path.suffix == ".yaml":
            items = scan_yaml_file(str(path))
        elif path.suffix == ".feature":
            items = scan_feature_file(str(path))
        else:
            print(f"지원하지 않는 파일 형식: {path.suffix}", file=sys.stderr)
            sys.exit(1)
    else:
        print(f"경로를 찾을 수 없음: {args.path}", file=sys.stderr)
        sys.exit(1)

    if args.overdue_only:
        items = [i for i in items if i.is_overdue]

    if args.format == "brief":
        print_brief(items)
    else:
        print_full(items)


if __name__ == "__main__":
    main()