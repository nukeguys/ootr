---
name: spec-review
description: domain.yaml과 시나리오의 일관성을 검토
context: fork
allowed-tools: Bash(python3)
---

## 작업 순서

1. **YAML 검증**: domain-validator 스킬 실행
2. **Mermaid 재생성**: yaml-to-mermaid 스킬로 다이어그램 갱신
3. **시나리오 커버리지 확인**:
   - 각 엔티티의 rule에 대응하는 시나리오가 .feature에 있는지
   - 각 관계에 대한 CRUD 시나리오가 있는지
   - 빠진 시나리오 목록 제시
4. **TBD 현황**: tbd-tracker 스킬로 미정 사항 요약
5. **변경 영향 분석**: 최근 변경된 엔티티/관계와 연결된 다른 도메인 파일 목록

## 출력

- 검증 결과 요약
- 빠진 시나리오 제안
- TBD 현황표
- Mermaid 다이어그램 (갱신된 것)
