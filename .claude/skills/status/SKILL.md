---
name: status
description: 프로젝트 스펙 현황을 종합 보고
context: fork
allowed-tools: Bash(python3)
---

## 보고 내용

1. **도메인 현황**
   - overview.yaml 기준 도메인별 status (confirmed / TBD / deferred)
   - 각 도메인의 엔티티 수, 관계 수

2. **TBD 현황**
   - tbd-tracker 스킬 실행
   - 기한이 지난 TBD 항목 강조

3. **시나리오 커버리지**
   - 도메인별 시나리오 수
   - 빠진 커버리지 추정

4. **최근 결정**
   - decisions.md의 최근 5건

5. **다음 단계 제안**
   - 우선적으로 결정해야 할 TBD
   - 시나리오가 부족한 도메인
   - 구현이 필요한 확정 항목
