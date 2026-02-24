# Overview YAML

> "프로젝트 전체의 뼈대" — 도메인 간 관계만 요약

```yaml
domains:
  - name: 도메인명
    description: '한 줄 설명'
    core_entities: [핵심엔티티, ...]
    status: confirmed | TBD | deferred
    priority: 1 # 숫자가 낮을수록 높은 우선순위
    note: '비고' # 선택

domain_connections:
  - { from: 도메인.엔티티, to: 도메인.엔티티, rel: 관계명 }
  # rel은 관계 타입 허용 목록에서 선택 (도메인 모델과 동일)
```

예시:

```yaml
domains:
  - name: auth
    description: '회원가입, 로그인, 프로필'
    core_entities: [User, Profile]
    status: confirmed
    priority: 1

  - name: content
    description: '게시물 작성, 피드'
    core_entities: [Post, Media]
    status: confirmed
    priority: 1

  - name: messaging
    description: 'DM, 채팅'
    core_entities: [Conversation, Message]
    status: deferred
    note: 'MVP 이후'
    priority: 3

domain_connections:
  - { from: auth.User, to: content.Post, rel: creates }
  - { from: auth.User, to: content.Post, rel: references }
```
