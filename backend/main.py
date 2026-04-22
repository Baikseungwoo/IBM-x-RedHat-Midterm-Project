import uvicorn
import app.db.models
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, async_engine
from fastapi.concurrency import asynccontextmanager
from dotenv import load_dotenv
from app.router.auth import router as auth_router
from app.router.user import router as user_router
from app.middleware.token_refresh import TokenRefreshMiddleware


load_dotenv(dotenv_path=".env")

# DB연결 후 metadata.create_all -> 모든 테이블 생성
@asynccontextmanager
async def lifespan(app:FastAPI):
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        yield
        await async_engine.dispose()

app=FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TokenRefreshMiddleware)

# 라우터 등록
app.include_router(auth_router)
app.include_router(user_router)


if __name__=="__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8081, reload=True)