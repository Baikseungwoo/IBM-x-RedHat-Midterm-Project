# 🎉 프로젝트 GIUT

## 프로젝트를 정상적으로 돌리시려면 네이버 맵을 사용할 수 있는 API키와 Openai에서 API키를 따로 발급받아서 넣어야합니다.
---
## 환경 변수 설정

프로젝트 실행 전 백엔드와 프론트엔드에 각각 `.env` 파일을 생성해야 합니다.

### 1. Backend 환경 변수 설정

아래 경로에 `.env` 파일을 생성합니다.

```bash
/backend/.env
```

그리고 다음 내용을 추가합니다.

```env
DB_USER="root"
DB_PASSWORD="DB 비밀번호"
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="DB 스키마 이름"

SECRET_KEY="SECRET_KEY"

# 행사 공공 데이터 관련
PUBLIC_API_BASE_URL="https://apis.data.go.kr/B551011/KorService2"
PUBLIC_API_KEY="cf4ceef411f3f2aa9b9e7f2aff2113f863347e073cad27ff35fa7bcd91ff2f25"

# OpenAI API 관련
OPENAI_API_KEY="발급받은 openAI-key"
OPENAI_MODEL="gpt-4o-mini"
```

### 2. Frontend 환경 변수 설정

아래 경로에 `.env` 파일을 생성합니다.

```bash
/root/frontend/front/.env
```

그리고 다음 내용을 추가합니다.

```env
VITE_NAVER_MAP_CLIENT_ID="발급받은 Naver Map Client ID"
```

환경 변수 설정을 완료한 뒤 백엔드와 프론트엔드를 실행하면 됩니다.
---

# 📌 프로젝트 개요

> 공공데이터(한국관광공사 API)를 활용한
> **지역 기반 행사 탐색 + AI 추천 코스 서비스**

| 항목        | 내용                   |
| --------- | -------------------- |
| 🎯 목적     | 사용자에게 맞춤형 행사 정보 제공   |
| 📍 핵심 기능  | 행사 조회, 검색, 필터, 추천 코스 |
| 👥 대상 사용자 | 여행/행사 탐색 사용자         |
| 🔗 데이터 출처 | 한국관광공사 API           |

---

# 🛠️ 기술 스택

| 구분       | 기술      |
| -------- | ------- |
| Frontend | React   |
| Backend  | FastAPI |
| Database | MySQL   |
| 외부 API   | 한국관광공사, openAI(GPT)  |

---

# 🌐 주요 기능

## 1️⃣ 행사 조회

| 기능     | 설명                  |
| ------ | ------------------- |
| 지역별 조회 | 지역 클릭 시 인기 행사 표시    |
| 상세 조회  | 행사 상세 정보 제공         |
| 검색     | 키워드 기반 행사 검색        |
| 필터     | 지역 / 날짜 / 상태 / 카테고리 |

---

## 2️⃣ 사용자 기능

| 기능     | 설명           |
| ------ | ------------ |
| 회원가입   | 사용자 계정 생성    |
| 로그인    | 인증 처리        |
| 프로필 관리 | 내 정보 조회 / 수정 |

---

## 3️⃣ 행사 상호작용

| 기능     | 설명              |
| ------ | --------------- |
| 👍 좋아요 | 행사 선호 표시        |
| 🔖 북마크 | 관심 행사 저장        |
| ✍️ 리뷰  | 후기 작성 / 수정 / 삭제 |

---

## 4️⃣ 추천 코스

| 기능       | 설명             |
| -------- | -------------- |
| 🤖 AI 추천 | 조건 기반 행사 3개 추천 |
| 💾 저장    | 추천 코스 저장       |
| 📂 조회    | 내 추천 코스 관리     |

---

# 🌿 브랜치 전략

## 📂 브랜치 구조

|브랜치 명 | 설명                   |담당              |역할   |
| ----------- | -------------------- | ------------------------ | ---------------- |
| `main`      | 🚀 최종 브랜치 (결과물 상태) | 백승우 |프로젝트 무결적 결과물|
| `backend/main`       | 🔧 backend 메인 통합 브랜치         | 백승우 | backend 무결 결과물|
| `backend/auth`       | 🔧 backend 인증/회원 브랜치         | 백승우 | 인증/회원 db, api 구현|
| `backend/AIapi`       | 🔧 backend ai 기능 브랜치         | 백승우 | AI 추천 db, api 구현 / openAI 활용 내부 api 구현|
| `backend/eventdbapi`       | 🔧 backend 공공 데이터 브랜치         | 백승우 | 공공데이터 db 동기화 내부 api 구현|
| `backend/database`       | 🔧 backend DB init 브랜치         | 백승우 | 프로젝트 DB database(세팅) 구현 |
| `backend/event`       | 🔧 backend 행사 정보 관련 기능 브랜치         | | 행사 정보 관련 기능 db, api 구현 |
| `backend/useraction`       | 🔧 backend 유저 행동관련 정보 브랜치(리뷰, 좋아요, 북마크)    |  | 리뷰, 좋아요, 북마크 정보 관련 기능 db, api 구현 |
| `frontend/main` | ✨ frontend 메인 통합 브랜치             | 박건일 |frontend 무결 결과물 |

---

## 📌 브랜치 규칙

* 모든 작업은 `*/main` 브랜치에서 각 팀장이 병합
* 각자 작업은 항상 각자의 브랜치에서만 커밋 푸쉬
* 작업을 시작할때 항상 각자의 브랜치에 */main 브랜치 내용 pull하고 작업하기 (ex. 만약 백엔드 브랜치인 경우 -> `git pull origin backend/main` )
* 본인 담당 작업이 완료되면 본인 브랜치에 푸쉬한 후 backend/main 또는 frontend/main에 pull request 보내기(팀원들에게 보고 후)
* 최종 프로젝트 → `main` merge
* main 브랜치는 담당자 말고는 건들지 말것

---


# 📑 API 명세서

👉 [📄 API 역할분담 명세서 바로가기](./API.md)

- 각 API의 상세 내용의 root폴더의 "api 명세서.xlsx" 파일을 확인 

> 📌 모든 API의 요청/응답 구조 및 상세 설명은 위 문서에서 확인 가능합니다.

---





