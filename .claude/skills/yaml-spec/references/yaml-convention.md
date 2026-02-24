# YAML 컨벤션

> 도메인 모델, 워크플로우, 프로젝트 overview에서 사용하는 YAML 작성 규칙

## 공통 규칙

### 상태 체계

모든 항목(엔티티, 속성, 관계, 단계, 도메인)에 적용 가능하다.

```yaml
# status를 생략하면 confirmed로 간주
status: confirmed    # 확정됨, 구현 가능
status: TBD          # 미정, 결정 필요
status: exploring    # 탐색 중, 후보군 검토 중
status: deferred     # 의도적으로 미룸
status: deprecated   # 제거 예정
```

### 불확실성 표현

```yaml
# 값을 모를 때
field: ???

# 결정이 필요할 때
field:
  status: TBD
  candidates: ["후보 A", "후보 B", "후보 C"]
  note: "판단 근거나 맥락"
  decision_by: "2025-03-01"  # 날짜 또는 조건 ("MVP 이후", "사용자 테스트 후")
```

### 표기 스타일

```yaml
# 단순한 항목은 한 줄(flow style)
props: { id: string, name: string, price: number }
- { from: User, to: Order, type: creates, card: 1:N }

# 복잡한 항목(TBD, 중첩)은 여러 줄(block style)
rating:
  type: integer
  min: 1
  max: ???
  status: TBD
  candidates: [5, 10, 100]
```

## 상세 규칙

- 도메인 모델 YAML 작성 규칙 : [yaml-domain.md](yaml-domain.md)
- 워크플로우 YAML 작성 규칙 : [yaml-workflow.md](yaml-workflow.md)
- overview YAML 작성 규칙 : [yaml-overview.md](yaml-overview.md)

## Decision 기록

> specs/decisions/decisions.md에 누적

```yaml
- date: YYYY-MM-DD
  topic: "결정 주제"
  decision: "결정 내용"
  reason: "이유"
  alternatives_rejected:
    - "기각된 후보: 기각 이유"
  affects: # 선택
    - "영향받는 파일/항목"
```

## 확장 규칙

### 새 타입/필드가 필요할 때

1. 관련 규칙 문서의 해당 섹션에 추가
2. 기존 항목과 일관된 네이밍 사용
3. 추가 이유를 간단히 주석으로 기록
