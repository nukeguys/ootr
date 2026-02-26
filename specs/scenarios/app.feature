Feature: 앱 공통 기능

  Scenario: 컬러모드 전환
    Given 사용자가 라이트 모드로 사용 중이다
    When 컬러모드를 전환한다
    Then 다크 모드로 변경된다

  Scenario: 오프라인 시 캐시된 추천 표시
    Given 이전에 복장 추천을 받은 적이 있다
    And 네트워크가 오프라인 상태이다
    When 페이지에 접속한다
    Then 마지막 조회된 복장 추천이 표시된다
    And 마지막 추천 시간이 함께 표시된다

  Scenario: 오프라인 + 캐시 없음
    Given 복장 추천을 받은 적이 없다
    And 네트워크가 오프라인 상태이다
    When 페이지에 접속한다
    Then 오프라인 안내 메시지가 표시된다

  Scenario: 초기 로딩 시 스켈레톤 UI 표시
    Given 사용자가 처음 접속한다
    And GPS 권한을 허용한 상태이다
    When 날씨 정보를 조회하는 중이다
    Then 날씨 영역에 스켈레톤 플레이스홀더가 표시된다
    And 복장 추천 영역에 스켈레톤 플레이스홀더가 표시된다
    And 푸터가 표시된다

  Scenario: 최초 접속 시 추천 시간 표시
    Given 사용자가 처음 접속한다
    And GPS 권한을 허용한 상태이다
    When 날씨 조회와 복장 추천이 완료된다
    Then 마지막 추천 시간이 표시된다

  Scenario: PWA 홈 화면 추가
    Given 모바일 브라우저에서 접속한다
    When 홈 화면에 추가한다
    Then 앱 아이콘으로 바로 실행할 수 있다
