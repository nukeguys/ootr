---
name: yaml-spec
description: domain YAML, workflow YAML, overview YAML을 작성하거나 수정할 때 사용. 컨벤션 규칙과 예시를 제공한다.
---

# YAML 스펙 작성 가이드

이 스킬은 프로젝트의 YAML 컨벤션을 정의한다.
YAML 파일을 생성하거나 수정할 때 반드시 이 규칙을 따른다.

## 핵심 규칙 요약

### 상태 체계

- status 생략 시 confirmed
- 미정: status: TBD + candidates + decision_by
- 값을 모를 때: ???

### 도메인 모델 (specs/domains/\*.yaml)

```yaml
entities:
  엔티티명:
    props: { 속성명: 타입, ... }
    rules:
      - '패턴 또는 자연어'

relationships:
  - { from: A, to: B, type: 관계타입, card: 카디널리티 }
```

### 허용된 관계 타입

has, contains, creates, triggers, belongs_to, references, requires, depends_on

### 허용된 카디널리티

1:1, 1:N, N:1, N:M

### 제약 조건 패턴

- unique(필드, ...) — 유니크
- range(필드, min, max) — 값 범위
- min(필드, 값), max(필드, 값) — 최소/최대
- length(필드, min, max) — 문자열 길이
- required(필드) — 필수
- requires(엔티티) — 전제 조건
- in(필드, 값|값|값) — 허용값
- immutable, immutable(필드) — 불변
- limit(조건, 값, 단위) — 빈도 제한
- 복잡한 규칙은 자연어 허용

### 워크플로우 (specs/workflows/\*.yaml)

```yaml
trigger:
  event: '시작 조건'
  source: '출처'

steps:
  단계명:
    type: event | action | decision | parallel | wait | retry | end
    description: '설명'
    next: 다음단계
```

YAML 파일은 references/yaml-convention.md를 따른다.
Gherkin 시나리오(.feature 파일)는 references/gherkin.md를 따른다.
