import base64

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.db.crud.review import (
    create_review,
    delete_review,
    list_reviews_by_content_id,
    update_review,
)
from app.db.scheme.review import ReviewCreate, ReviewUpdate


def _encode_image_data(image_data: bytes | None) -> str | None:
    if not image_data:
        return None
    return base64.b64encode(image_data).decode("utf-8")


def _review_to_dict(review, user: User | None = None) -> dict:
    return {
        "review_id": review.review_id,
        "user_id": review.user_id,
        "content_id": review.content_id,
        "content": review.content,
        "created_at": review.created_at,
        "updated_at": review.updated_at,
        "nickname": user.nickname if user else None,
        "image_data": _encode_image_data(user.image_data) if user else None,
    }


async def list_reviews_service(db: AsyncSession, content_id: int) -> dict:
    reviews = await list_reviews_by_content_id(db, content_id)
    return {"success": True, "reviews": reviews}


async def create_review_service(
    db: AsyncSession,
    user_id: int,
    content_id: int,
    payload: ReviewCreate,
) -> dict:
    review = await create_review(
        db=db,
        user_id=user_id,
        content_id=content_id,
        content=payload.content.strip(),
    )
    if review is None:
        raise HTTPException(status_code=404, detail="Event not found")

    user = await db.get(User, user_id)
    return {"success": True, "review": _review_to_dict(review, user)}


async def update_review_service(
    db: AsyncSession,
    user_id: int,
    review_id: int,
    payload: ReviewUpdate,
) -> dict:
    if payload.content is None :
        raise HTTPException(status_code=400, detail="No fields to update")

    content = payload.content.strip() if payload.content is not None else None
    review = await update_review(
        db=db,
        review_id=review_id,
        user_id=user_id,
        content=content,
    )
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found or no permission")

    return {"success": True, "review": _review_to_dict(review)}


async def delete_review_service(db: AsyncSession, user_id: int, review_id: int) -> dict:
    deleted = await delete_review(db, review_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Review not found or no permission")

    return {"success": True, "review_id": review_id}
