# Docker 실행 방법

## 기본 실행

현재 구성은 MySQL, 백엔드, 프론트를 Docker Compose로 같이 실행합니다.

먼저 예시 파일을 복사해서 실제 환경변수 파일을 만듭니다.

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
```

`.env`와 `backend/.env`에서 실제 값을 채웁니다.

```powershell
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8081
- MySQL: localhost:3306

## DB 연결

백엔드는 Compose 내부 네트워크에서 MySQL 컨테이너를 `mysql`이라는 호스트 이름으로 바라봅니다.

기본 DB 설정은 다음과 같습니다.

- Host: `mysql`
- Port: `3306`
- Database: `bsw3`
- User: `root`
- Password: `.env`의 `MYSQL_ROOT_PASSWORD`

MySQL 데이터는 `mysql_data` Docker volume에 저장됩니다. 컨테이너를 재시작해도 데이터가 유지됩니다.

기존 로컬 MySQL 데이터를 옮기려면 먼저 dump를 만든 뒤 새 MySQL 컨테이너에 import 해야 합니다.

```powershell
mysqldump -u root -p bsw3 > bsw3.sql
Get-Content bsw3.sql | docker compose exec -T mysql mysql -u root "-p$env:MYSQL_ROOT_PASSWORD" bsw3
```

## 이미지 빌드만 하기

```powershell
docker compose build
```

생성되는 이미지 이름은 다음과 같습니다.

- `midterm-backend:local`
- `midterm-frontend:local`

## 프론트에서 백엔드 주소 바꾸기

기본 API 주소는 `http://localhost:8081`입니다.
배포 환경에서 다른 백엔드 주소를 쓰려면 빌드 시 `VITE_API_BASE_URL`을 넘기면 됩니다.

```powershell
$env:VITE_API_BASE_URL="https://api.example.com"
docker compose build frontend
```

## 네이버 맵 키

프론트의 네이버 맵 키는 Vite 빌드 시점에 들어갑니다.
`.env`의 `VITE_NAVER_MAP_CLIENT_ID`에 값을 넣고 다시 빌드하세요.

## 중지

```powershell
docker compose down
```

DB 데이터까지 완전히 지우려면 volume도 같이 삭제합니다.

```powershell
docker compose down -v
```

## VPS/EC2 배포

Docker Compose 구성을 그대로 배포하려면 Render보다 VPS나 EC2 같은 서버가 적합합니다.

서버에서 Docker와 Docker Compose를 설치한 뒤 프로젝트를 가져옵니다.

```bash
git clone <your-repository-url>
cd IBM-x-RedHat-Midterm-Project
```

예시 파일을 복사해서 실제 환경변수 파일을 만듭니다.

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

`.env`와 `backend/.env`에서 실제 값을 채웁니다.

- `.env`의 `VITE_API_BASE_URL`: `http://<server-ip>:8081`
- `.env`의 `VITE_NAVER_MAP_CLIENT_ID`: 네이버 맵 키
- `.env`의 `CORS_ORIGINS`: `http://<server-ip>:5173`
- `backend/.env`의 `PUBLIC_API_KEY`: 공공데이터 키
- `backend/.env`의 `OPENAI_API_KEY`: OpenAI 키
- `backend/.env`의 `SECRET_KEY`: 임의의 긴 비밀값
- `backend/.env`의 DB 값은 Compose에서 덮어쓰지만 로컬 실행용으로 맞춰둬도 됩니다.

실행합니다.

```bash
docker compose up --build -d
```

서버 방화벽과 클라우드 보안 그룹에서 다음 포트를 열어야 합니다.

- `5173`: 프론트
- `8081`: 백엔드

MySQL 포트 `3306`은 외부 접속이 꼭 필요한 경우가 아니면 열지 않는 편이 안전합니다.

로그 확인:

```bash
docker compose logs -f
```

## GitHub에 올리면 안 되는 파일

다음 파일은 실제 키가 들어가므로 GitHub에 올리면 안 됩니다.

- `.env`
- `backend/.env`
- `frontend/front/.env`

대신 다음 예시 파일만 올립니다.

- `.env.example`
- `backend/.env.example`
- `frontend/front/.env.example`
