# 📑 API 역할 분담 명세서

> API를 역할(도메인) 기준으로 분류하여 충돌 없이 개발하기 위한 문서


---

# 🏠 내부 AI (백승우)
- 공공 데이터 API -> 프로젝트 DB 동기화 API
- openAI(GPT) Token 활용 API  

---

# 🔐 인증 / 회원 (백승우)

| Method | URL                        | 설명        | 사용 테이블 |
| ------ | -------------------------- | --------- | ------ |
| POST   | `/api/auth/signup`         | 회원가입      | User   |
| POST   | `/api/auth/login`          | 로그인       | User   |
| POST   | `/api/auth/find-email`     | 이메일 찾기    | User   |
| GET    | `/api/auth/check-email`    | 이메일 중복 확인 | User   |
| GET    | `/api/auth/check-nickname` | 닉네임 중복 확인 | User   |
| GET    | `/api/users/me`            | 내 정보 조회   | User   |
| PUT    | `/api/users/me`            | 내 정보 수정   | User   |

---

# 🤖 AI 추천 코스 (백승우)

| Method | URL                                 | 설명         | 사용 테이블              |
| ------ | ----------------------------------- | ---------- | ------------------- |
| POST   | `/api/courses/recommend`            | 추천 코스 생성   | Event, Course       |
| POST   | `/api/courses`                      | 추천 코스 저장   | Course, Course_Item |
| GET    | `/api/users/me/courses`             | 내 추천 코스 조회 | Course, Course_Item |
| DELETE | `/api/users/me/courses/{course_id}` | 추천 코스 삭제   | Course, Course_Item |

---

# 📊 행사 조회 (B)

| Method | URL                                | 설명           | 사용 테이블              |
| ------ | ---------------------------------- | ------------ | ------------------- |
| GET    | `/api/events/regions/{region}/top` | 지역별 인기 행사 조회 | Event               |
| GET    | `/api/events/top`                  | 전체 인기 행사 조회  | Event               |
| GET    | `/api/events/{content_id}`         | 행사 상세 조회     | Event, Event_Detail |
| GET    | `/api/events`                      | 전체 행사 목록 조회  | Event               |
| GET    | `/api/events/filter`               | 조건 필터 조회     | Event               |
| GET    | `/api/search`                      | 통합 검색        | Event               |
| GET    | `/api/categories`                  | 카테고리 목록      | Event               |
| GET    | `/api/events/autocomplete`         | 자동완성 검색      | Event               |

---

# ❤️ 행사 상호작용 (C)

| Method | URL                                         | 설명        | 사용 테이블          |
| ------ | ------------------------------------------- | --------- | --------------- |
| POST   | `/api/events/{content_id}/likes/toggle`     | 좋아요 토글    | Like, Event     |
| GET    | `/api/events/{content_id}/likes/me`         | 좋아요 여부 확인 | Like            |
| POST   | `/api/events/{content_id}/bookmarks/toggle` | 북마크 토글    | Bookmark, Event |
| GET    | `/api/events/{content_id}/bookmarks/me`     | 북마크 여부 확인 | Bookmark        |
| GET    | `/api/events/{content_id}/reviews`          | 리뷰 목록 조회  | Review, User    |
| POST   | `/api/events/{content_id}/reviews`          | 리뷰 작성     | Review          |
| PATCH  | `/api/reviews/{review_id}`                  | 리뷰 수정     | Review          |
| DELETE | `/api/reviews/{review_id}`                  | 리뷰 삭제     | Review          |
| GET    | `/api/users/me/bookmarks`                   | 내 북마크 목록  | Bookmark, Event |
| DELETE | `/api/users/me/bookmarks/{content_id}`      | 북마크 삭제    | Bookmark, Event |

---




