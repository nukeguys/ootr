# 워크플로우 YAML

> "무엇이 어떤 순서로 일어나는가"

## 트리거

```yaml
trigger:
  event: "워크플로우 시작 조건"
  source: "이벤트 출처"
```

## 노드 타입: Step

```yaml
steps:
  단계명:
    type: 단계유형
    description: "이 단계가 하는 일"
    on_failure: ... # 실패 처리 (선택, 모든 type에 적용 가능)
    # 이하 type별 추가 필드
```

### type 허용값

```yaml
# event — 외부 이벤트 수신 (워크플로우 시작점)
step_name:
  type: event
  description: "설명"
  next: 다음단계

# action — 실제 작업 수행
step_name:
  type: action
  description: "설명"
  actor: "수행 주체"        # 서비스명, 사람, 시스템 (선택)
  tool: "사용 도구/API"     # 선택
  input: "입력"             # 선택
  output: "출력"            # 선택
  next: 다음단계

# decision — 조건 분기 (2개)
step_name:
  type: decision
  description: "설명"
  condition: "분기 조건"
  if_yes: 단계명
  if_no: 단계명

# decision — 조건 분기 (3개 이상)
step_name:
  type: decision
  description: "설명"
  cases:
    - { condition: "조건 A", next: step_a }
    - { condition: "조건 B", next: step_b }
    - { condition: "조건 C", next: step_c }
  default: step_fallback     # 어떤 조건에도 해당하지 않을 때

# parallel — 병렬 실행
step_name:
  type: parallel
  description: "설명"
  branches:
    - name: 분기명
      tool: "도구"
      # ... 각 분기별 설정
  next: 다음단계            # 모든 분기 완료 후

# wait — 대기
step_name:
  type: wait
  description: "설명"
  duration: "30m"           # 시간 기반: 30m, 1h, 1d 등
  # 또는
  until: "외부 조건 설명"    # 조건 기반: "사용자 승인", "웹훅 수신" 등
  next: 다음단계

# retry — 재시도 루프
step_name:
  type: retry
  description: "설명"
  target: 재시도할_단계명
  max_attempts: 3
  interval: "5m"            # 재시도 간격
  on_exhaust: 실패시_단계명   # 최대 시도 초과 시

# end — 워크플로우 종료
step_name:
  type: end
```

## 흐름 연결

```yaml
# 단일 다음 단계
next: step_name

# 여러 단계로 동시 진행 (fork)
next: [step_a, step_b]

# 조건 분기 (decision, 2개)
if_yes: step_name
if_no: step_name

# 조건 분기 (decision, 다중)
cases:
  - { condition: "조건", next: step_name }
default: step_name
```

## 실패 처리

모든 step type에 선택적으로 on_failure를 붙일 수 있다.

```yaml
on_failure:
  strategy: retry | skip | abort | notify
  next: 실패시_이동할_단계 # 선택
  # 또는 미정일 때
  status: TBD
  candidates: ["재시도 3회", "알림 후 중단", "수동 처리 큐"]
```

## 도메인 엔티티 연결 (선택)

워크플로우 단계가 어떤 도메인 엔티티에 영향을 주는지 명시한다. 도메인 모델 YAML과의 연결점.

```yaml
touches:
  - entity: 엔티티명
    field: 필드명 # 선택
    action: read | create | update | delete
```
