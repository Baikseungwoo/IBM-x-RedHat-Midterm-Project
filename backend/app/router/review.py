from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_user_id
from app.db.database import get_db
from app.db.scheme.review import ReviewUpdate
from app.service.review import delete_review_service, update_review_service

router = APIRouter(prefix="/api/reviews", tags=["Detail"])


@router.patch("/{review_id}")
async def update_review(
    review_id: int,
    payload: ReviewUpdate,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await update_review_service(db, user_id, review_id, payload)


@router.delete("/{review_id}")
async def delete_review(
    review_id: int,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await delete_review_service(db, user_id, review_id)
