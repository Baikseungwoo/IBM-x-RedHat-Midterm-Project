from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_user_id
from app.db.database import get_db
from app.db.scheme.review import ReviewCreate
from app.service.bookmark import get_bookmark_me_service, toggle_bookmark_service
from app.service.like import get_like_me_service, toggle_like_service
from app.service.review import create_review_service, list_reviews_service

router = APIRouter(prefix="/api", tags=["Detail"])


@router.post("/events/{content_id}/likes/toggle")
async def toggle_like(
    content_id: int,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await toggle_like_service(db, user_id, content_id)


@router.get("/events/{content_id}/likes/me")
async def like_me(
    content_id: int,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await get_like_me_service(db, user_id, content_id)


@router.post("/events/{content_id}/bookmarks/toggle")
async def toggle_bookmark(
    content_id: int,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await toggle_bookmark_service(db, user_id, content_id)


@router.get("/events/{content_id}/bookmarks/me")
async def bookmark_me(
    content_id: int,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await get_bookmark_me_service(db, user_id, content_id)


@router.get("/events/{content_id}/reviews")
async def list_reviews(
    content_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await list_reviews_service(db, content_id)


@router.post("/events/{content_id}/reviews")
async def create_review(
    content_id: int,
    payload: ReviewCreate,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await create_review_service(db, user_id, content_id, payload)
