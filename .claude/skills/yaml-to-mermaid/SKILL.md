---
name: yaml-to-mermaid
description: domain YAML 파일에서 Mermaid erDiagram을 자동 생성할 때 사용
model: sonnet
allowed-tools: Bash(python3)
---

## 사용법

specs/domains/\*.yaml 파일이 변경되었을 때 이 스킬을 사용하여
Mermaid erDiagram을 생성한다.

## 실행

```bash
python3 .claude/skills/yaml-to-mermaid/scripts/convert.py specs/domains/<파일명>.yaml
```

출력된 Mermaid 코드를 해당 YAML 파일과 같은 이름의 .mmd 파일로 저장한다. 예: specs/domains/auth.yaml → specs/domains/auth.mmd

overview.yaml의 경우 도메인 간 연결만 표시하는 요약 다이어그램을 생성한다.
