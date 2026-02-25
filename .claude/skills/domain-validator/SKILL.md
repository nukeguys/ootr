---
name: domain-validator
description: domain YAML 파일의 무결성을 검증할 때 사용. 엔티티 참조 오류, 누락된 관계, 고아 엔티티 등을 탐지
allowed-tools: Bash(python3)
---

## 사용법

domain YAML이 변경된 후 이 스킬로 검증한다.

## 실행

```bash
python3 .claude/skills/domain-validator/scripts/validate.py specs/domains/
```

## 검증 항목

- 관계의 from/to가 존재하는 엔티티를 참조하는지
- overview.yaml의 core_entities가 실제 도메인 파일에 정의되어 있는지
- 고아 엔티티 (어떤 관계에도 참여하지 않는 엔티티) 경고
- TBD 항목 수 및 결정 기한 요약
- 카디널리티 표기 오류 (1:1, 1:N, N:1, N:M 외의 값)
