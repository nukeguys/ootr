# 도메인 모델 YAML

> "시스템에 무엇이 있고, 어떻게 연결되는가"

## 노드 타입: Entity

```yaml
entities:
  엔티티명:
    props: { 속성명: 타입, ... }
    rules: # 제약 조건 배열
      - '규칙 설명'
    status: confirmed # 생략 시 confirmed
```

예시:

```yaml
entities:
  User:
    props: { id: string, email: string, isLoggedIn: boolean }
    rules: ['email unique']

  Review:
    props: { id: string, rating: integer, content: string, createdAt: datetime }
    rules:
      - 'rating: 1..5'
      - 'unique(userId, productId)'
      - '삭제 불가'
```

## 제약 조건 패턴 (rules 작성 규칙)

**유니크 제약:**

```yaml
- 'unique(email)' # 단일 필드
- 'unique(userId, productId)' # 복합 필드
```

**범위/크기 제약:**

```yaml
- 'range(rating, 1, 5)' # 값 범위 (min ~ max)
- 'min(stock, 0)' # 최소값
- 'max(price, 10000000)' # 최대값
- 'length(nickname, 2, 20)' # 문자열 길이 (min ~ max)
```

**필수/존재 제약:**

```yaml
- 'required(email)' # 필수 입력
- 'requires(Purchase)' # 전제 조건 (다른 엔티티가 존재해야 함)
```

**허용값 제약:**

```yaml
- 'in(role, admin|editor|viewer)' # 허용값 목록 (간단한 경우)
```

> enum이 상태 전이(transitions)까지 필요한 경우는 enums 섹션을 사용한다.

**불변성:**

```yaml
- 'immutable' # 엔티티 전체 수정/삭제 불가
- 'immutable(email)' # 특정 필드만 수정 불가
```

**빈도/횟수 제약:**

```yaml
- 'limit(user, 5, per_day)' # 사용자당 하루 5회
- 'limit(user+product, 1, total)' # 사용자+상품 조합당 총 1회
```

**복잡한 비즈니스 규칙 (자연어):**

```yaml
- '작성 후 24시간 이내에만 수정 가능'
- '본인이 작성한 리뷰만 수정 가능'
```

> **원칙**: 패턴으로 표현 가능하면 패턴을 사용한다. 자연어는 패턴으로 표현하기 어려운 경우에만 사용한다. 새 패턴이 필요하면 이 목록에 추가하고 기록한다.

예시:

```yaml
entities:
  Review:
    props: { id: string, rating: integer, content: string, createdAt: datetime }
    rules:
      - 'unique(userId, productId)'
      - 'range(rating, 1, 5)'
      - 'length(content, 1, 2200)'
      - 'required(rating)'
      - 'requires(Purchase)'
      - 'immutable'
```

## 속성 타입

```text
string      문자열
integer     정수
number      실수 포함
boolean     true/false
datetime    날짜+시간
enum        열거형 (enums 섹션에서 상세 정의)
hashed      해시된 문자열 (비밀번호 등)
```

필요 시 타입을 추가할 수 있다. 추가한 타입은 이 문서에 기록한다.

## Enum 정의

열거형 속성이 있으면 도메인 파일 내에 enums 섹션으로 정의한다.

```yaml
enums:
  OrderStatus:
    values: [pending, paid, shipped, delivered, cancelled]
    default: pending
    transitions: # 상태 전이 제약 (선택)
      pending: [paid, cancelled]
      paid: [shipped, cancelled]
      shipped: [delivered]

  Visibility:
    values: [public, followers, private]
    default: public
```

엔티티에서 참조할 때:

```yaml
entities:
  Order:
    props: { id: string, status: enum(OrderStatus), createdAt: datetime }
```

## 관계 타입: Relationship

```yaml
relationships:
  - from: 출발엔티티
    to: 도착엔티티
    type: 관계명 # 관계 타입 허용 목록에서 선택
    card: 카디널리티 # 1:1, 1:N, N:1, N:M
    on_delete: 삭제정책 # cascade, restrict, set_null (선택)
    constraint: '추가 제약' # 선택
```

예시:

```yaml
relationships:
  - { from: User, to: Review, type: creates, card: 1:N, on_delete: cascade }
  - {
      from: Review,
      to: Product,
      type: belongs_to,
      card: N:1,
      on_delete: restrict,
    }
  - { from: User, to: Product, type: references, card: N:M }
```

## 관계 타입 허용 목록

관계의 type 필드는 아래 목록에서 선택한다. 프로젝트에서 새 관계 타입이 필요하면 이 목록에 추가하고 기록한다. overview.yaml의 domain_connections에서도 동일한 목록을 사용한다.

**소유/포함 관계:**

```text
has          1:1 소유 (User has Profile)
contains     1:N 포함 (Cart contains Product)
```

**생성/행위 관계:**

```text
creates      생성한다 (User creates Order)
triggers     유발한다 (Order triggers Notification)
```

**참조/연관 관계:**

```text
belongs_to   소속된다 (Review belongs_to Product)
references   참조한다 (Order references Product)
```

**의존/조건 관계:**

```texts
requires     전제 조건 (Review requires Purchase)
depends_on   의존한다 (Shipment depends_on Payment)
```

> **원칙**: 동의어를 피한다. "writes"와 "creates"가 같은 의미라면 하나만 사용한다. 새 타입이 필요할 때: 기존 목록으로 표현할 수 없는 경우에만 추가하고, 이 문서에 기록한다.

## 카디널리티 허용값

```text
1:1   하나 대 하나 (User - Profile)
1:N   하나 대 다수 (User - Order)
N:1   다수 대 하나 (Review - Product)
N:M   다수 대 다수 (User - Product via Purchase)
```
