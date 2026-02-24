# Gherkin 컨벤션

> "각 행위의 기대 결과" — 검증 기준

## 태그

```gherkin
@confirmed          # 확정된 시나리오 (기본, 생략 가능)
@TBD                # 미정 (주석으로 후보군 기록)
@post-mvp           # MVP 이후
@decision-needed    # 결정 필요 (기한 명시)
```

## 구조

```gherkin
Feature: 도메인명 또는 기능명

  Scenario: 정상 케이스
    Given 사전 조건
    When 사용자 행위
    Then 기대 결과

  Scenario: 예외 케이스 (제약 조건 위반)
    Given 사전 조건
    When 제약 위반 행위
    Then Error("에러 메시지")

  @TBD @decision-needed
  Scenario: 미정 시나리오
    # 후보 A: 설명
    # 후보 B: 설명
    # 결정 기한: YYYY-MM-DD 또는 조건
    Given ...
    When ...
    Then ...
```
