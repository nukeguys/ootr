Feature: 러닝 복장 추천 엔진

  Background:
    Given 현재 날씨 정보가 조회된 상태이다

  # 온도대별 상의 프리셋 (다중 후보 — 랜덤 선택)

  Scenario: 무더위 (feelsLike ≥ 25, 바람 없음, 강수 없음) — hot 프리셋
    And 체감온도가 27°C이고 바람과 강수가 없다
    When 복장 추천이 생성된다
    Then 상의는 "싱글렛" 또는 "반팔 티셔츠" 중 하나가 추천된다

  Scenario: 따뜻함 + 바람/강수 (feelsLike ≥ 20) — warm-wind 프리셋
    And 체감온도가 22°C이고 풍속이 7m/s이다
    When 복장 추천이 생성된다
    Then 상의는 "반팔 티셔츠, 바람막이" 순으로 추천된다

  Scenario: 따뜻함 (feelsLike ≥ 20) — warm 프리셋
    And 체감온도가 22°C이고 바람과 강수가 없다
    When 복장 추천이 생성된다
    Then 상의는 "싱글렛" 또는 "반팔 티셔츠" 중 하나가 추천된다

  Scenario: 온화함 + 바람/강수 (feelsLike ≥ 12) — mild-wind 프리셋
    And 체감온도가 15°C이고 풍속이 7m/s이다
    When 복장 추천이 생성된다
    Then 상의는 "긴팔 티셔츠+바람막이" 또는 "하프 집업+바람막이" 중 하나가 추천된다

  Scenario: 온화함 (feelsLike ≥ 12) — mild 프리셋
    And 체감온도가 15°C이고 바람과 강수가 없다
    When 복장 추천이 생성된다
    Then 상의는 "긴팔 티셔츠" 또는 "하프 집업" 중 하나가 추천된다

  Scenario: 선선함 + 바람/강수 (feelsLike ≥ 5) — cool-wind 프리셋
    And 체감온도가 8°C이고 풍속이 7m/s이다
    When 복장 추천이 생성된다
    Then 상의는 "하프 집업+바람막이" 또는 "긴팔 티셔츠+바람막이" 중 하나가 추천된다

  Scenario: 선선함 (feelsLike ≥ 5) — cool 프리셋
    And 체감온도가 8°C이고 바람과 강수가 없다
    When 복장 추천이 생성된다
    Then 상의는 "하프 집업" 또는 "기모 하프 집업" 또는 "긴팔 티셔츠+바람막이" 중 하나가 추천된다

  Scenario: 추위 + 바람/강수 (feelsLike ≥ 0) — cold-wind 프리셋
    And 체감온도가 2°C이고 풍속이 7m/s이다
    When 복장 추천이 생성된다
    Then 상의는 "기모 하프 집업+바람막이" 또는 "하프 집업+바람막이" 중 하나가 추천된다

  Scenario: 추위 (feelsLike ≥ 0) — cold 프리셋
    And 체감온도가 3°C이고 바람과 강수가 없다
    When 복장 추천이 생성된다
    Then 상의는 "기모 하프 집업" 또는 "긴팔 티셔츠+바람막이" 또는 "기모 하프 집업+바람막이" 중 하나가 추천된다

  Scenario: 영하 + 바람/강수 (feelsLike ≥ -4) — very-cold-wind 프리셋
    And 체감온도가 -2°C이고 풍속이 7m/s이다
    When 복장 추천이 생성된다
    Then 상의는 "반팔 티셔츠+기모 하프 집업+바람막이" 또는 "기모 하프 집업+바람막이" 중 하나가 추천된다

  Scenario: 영하 (feelsLike ≥ -4) — very-cold 프리셋
    And 체감온도가 -2°C이고 바람과 강수가 없다
    When 복장 추천이 생성된다
    Then 상의는 "기모 하프 집업+바람막이" 또는 "하프 집업+바람막이" 중 하나가 추천된다

  Scenario: 극한 추위 (feelsLike ≥ -8) — extreme-cold 프리셋
    And 체감온도가 -5°C이다
    When 복장 추천이 생성된다
    Then 상의는 "반팔+기모+바람막이" 또는 "긴팔+패딩 조끼+바람막이" 또는 "하프집업+패딩 조끼+바람막이" 중 하나가 추천된다

  Scenario: 극한 추위 심화 (feelsLike < -8) — extreme-cold-deep 프리셋
    And 체감온도가 -12°C이다
    When 복장 추천이 생성된다
    Then 상의는 "기모+패딩 조끼+바람막이" 또는 "반팔+기모+패딩 조끼+바람막이" 중 하나가 추천된다

  # 하의 선택

  Scenario: feelsLike ≥ 10, 바람 없음 — 쇼츠
    And 체감온도가 15°C이고 바람이 없다
    When 복장 추천이 생성된다
    Then 하의는 "쇼츠"가 추천된다

  Scenario: feelsLike ≥ 10, 강풍, feelsLike < 13 — 강풍 오버라이드: 긴바지
    And 체감온도가 11°C이고 풍속이 7m/s이다
    When 복장 추천이 생성된다
    Then 하의는 "긴바지"가 추천된다

  Scenario: -4 ≤ feelsLike < 10 — 긴바지
    And 체감온도가 5°C이고 바람이 없다
    When 복장 추천이 생성된다
    Then 하의는 "긴바지"가 추천된다

  Scenario: feelsLike < -4 — 기모 바지
    And 체감온도가 -5°C이다
    When 복장 추천이 생성된다
    Then 하의는 "기모 바지"가 추천된다

  # 악세서리

  Scenario: 자외선 지수 높음 (isDay, uvIndex > 3) — 모자 + 선글라스
    And 체감온도가 22°C이고 주간이며 자외선 지수가 5이다
    When 복장 추천이 생성된다
    Then 악세서리에 "모자"와 "선글라스"가 포함된다

  Scenario: 야간 러닝 — 반사 장비
    And 체감온도가 22°C이고 야간이다
    When 복장 추천이 생성된다
    Then 악세서리에 "반사 장비"가 포함된다

  Scenario: feelsLike < -4 — 두꺼운 장갑
    And 체감온도가 -5°C이다
    When 복장 추천이 생성된다
    Then 악세서리에 "두꺼운 장갑"이 포함된다

  Scenario: feelsLike < -5 — 마스크 + 두꺼운 장갑
    And 체감온도가 -6°C이다
    When 복장 추천이 생성된다
    Then 악세서리에 "마스크"와 "두꺼운 장갑"이 포함된다

  # 장갑

  Scenario: 0 ≤ feelsLike < 10 — 장갑
    And 체감온도가 5°C이다
    When 복장 추천이 생성된다
    Then 악세서리에 "장갑"이 포함된다

  # 기모 하프 집업 레이어링

  Scenario: 기모 하프 집업은 반팔 위에만 착용
    And 체감온도가 -2°C이고 풍속이 7m/s이다
    When 복장 추천이 생성되어 "반팔 티셔츠+기모 하프 집업+바람막이"가 선택된다
    Then 상의 순서는 "반팔 티셔츠", "기모 하프 집업", "바람막이" 순이다

  # 추천 이유

  Scenario: 추천 이유 표시
    And 체감온도가 15°C이다
    When 복장 추천이 생성된다
    Then 추천 이유가 자연어로 함께 표시된다

  # OutfitSet UI 표시

  Scenario: OutfitSet 아이템이 쉼표로 구분되어 표시된다
    And 체감온도가 15°C이고 풍속이 7m/s이다
    When 복장 추천이 생성된다
    Then 상의는 "긴팔 티셔츠, 바람막이" 형태로 쉼표 구분되어 표시된다

  # 극한 날씨 경고

  Scenario: 극한 더위 (feelsLike ≥ 30)
    And 체감온도가 32°C이다
    When 복장 추천이 생성된다
    Then isExtremeWeather가 true이다
    And "극한 더위" 경고가 표시된다

  Scenario: 극한 추위 (feelsLike < -10)
    And 체감온도가 -12°C이다
    When 복장 추천이 생성된다
    Then isExtremeWeather가 true이다
    And "극한 추위" 경고가 표시된다

  Scenario: 강한 강수 (precipitation > 3mm)
    And 강수량이 5mm이다
    When 복장 추천이 생성된다
    Then "강한 비/눈" 경고가 표시된다

  # 날씨 미조회 시

  Scenario: 날씨 조회 실패 시 복장 추천 숨김
    Given 날씨 정보 조회에 실패한 상태이다
    When 페이지를 접속한다
    Then 복장 추천 영역이 표시되지 않는다
