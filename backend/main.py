import logging
from contextlib import asynccontextmanager
from zoneinfo import ZoneInfo

import uvicorn
import app.db.models
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import AsyncSessionLocal, Base, async_engine
from app.middleware.token_refresh import TokenRefreshMiddleware
from app.router.auth import router as auth_router
from app.router.user import router as user_router
from app.router.event import router as event_router
from app.service.event_ingest import sync_recent_and_upcoming_events_service

load_dotenv(dotenv_path=".env")

logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler(timezone=ZoneInfo("Asia/Seoul"))


async def daily_sync_job() -> None:
    async with AsyncSessionLocal() as session:
        try:
            result = await sync_recent_and_upcoming_events_service(db=session, size=100)
            logger.info("daily sync done: %s", result)
        except Exception:
            logger.exception("daily sync failed")


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 매일 새벽 3시에 공공데이터 동기화 실행
    # scheduler.add_job(
    #     daily_sync_job,
    #     CronTrigger(hour=3, minute=0),
    #     id="daily_event_sync",
    #     replace_existing=True,
    #     max_instances=1,
    #     coalesce=True,
    # )
    # scheduler.start()

    #동기화 즉시실행
    await daily_sync_job()

    yield

    # scheduler.shutdown(wait=False)
    await async_engine.dispose()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(TokenRefreshMiddleware)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(event_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8081, reload=True)
