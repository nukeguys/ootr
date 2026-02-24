---
name: tbd-tracker
description: 프로젝트의 미정(TBD) 사항을 추적하고 현황을 보여줄 때 사용
model: sonnet
allowed-tools: Bash(python3)
---

## 사용법

```bash
python3 .claude/skills/tbd-tracker/scripts/scan_tbd.py specs/
```

## 기능

- specs/ 하위 모든 .yaml과 .feature 파일에서 TBD, ???, exploring, deferred 항목 수집
- 결정 기한(decision_by) 기준으로 정렬
- 기한이 지난 항목 강조 표시
- 도메인별 TBD 수 요약
