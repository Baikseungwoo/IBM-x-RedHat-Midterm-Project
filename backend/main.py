import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, async_engine
from fastapi.concurrency import asynccontextmanager
from dotenv import load_dotenv


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



if __name__=="__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8081, reload=True)