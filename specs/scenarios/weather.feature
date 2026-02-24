Feature: 날씨 정보 조회

  Scenario: GPS로 현재 위치 날씨 조회
    Given 사용자가 GPS 권한을 허용한 상태이다
    When 페이지에 접속한다
    Then 현재 위치의 날씨 정보가 표시된다
    And 기온, 체감온도, 강수/눈, 바람, 습도, 대기상태, 자외선, 낮/밤 정보가 포함된다

  Scenario: GPS 권한 거부
    Given 사용자가 GPS 권한을 거부한 상태이다
    When 페이지에 접속한다
    Then "위치 권한이 필요합니다" 안내 메시지가 표시된다

  Scenario: 새로고침으로 날씨 갱신
    Given 날씨 정보가 표시된 상태이다
    When 새로고침 버튼을 누른다
    Then 최신 날씨 정보가 다시 조회된다
    And 복장 추천이 갱신된다
    And 마지막 추천 시간이 업데이트된다

  Scenario: GPS가 유효하지 않은 좌표를 반환
    Given 사용자가 GPS 권한을 허용한 상태이다
    And GPS가 유효 범위 밖의 좌표를 반환한다
    When 페이지에 접속한다
    Then 위치 정보를 가져올 수 없다는 에러 메시지가 표시된다

  Scenario: 날씨 API 호출 실패
    Given 사용자가 GPS 권한을 허용한 상태이다
    And WeatherAPI가 응답하지 않는다
    When 페이지에 접속한다
    Then 에러 메시지가 표시된다
