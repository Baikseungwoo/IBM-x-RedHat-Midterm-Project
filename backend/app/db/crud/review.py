from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.event import Event
from app.db.models.review import Review
from app.db.models.user import User


async def list_reviews_by_content_id(db: AsyncSession, content_id: int) -> list[dict]:
    stmt = (
        select(Review, User.nickname)
        .join(User, User.user_id == Review.user_id)
        .where(Review.content_id == content_id)
        .order_by(Review.created_at.desc())
    )
    rows = (await db.execute(stmt)).all()

    reviews: list[dict] = []
    for review, nickname in rows:
        reviews.append(
            {
                "review_id": review.review_id,
                "user_id": review.user_id,
                "content_id": review.content_id,
                "content": review.content,
                "created_at": review.created_at,
                "updated_at": review.updated_at,
                "nickname": nickname,
            }
        )
    return reviews


async def create_review(
    db: AsyncSession,
    user_id: int,
    content_id: int,
    content: str,
) -> Review | None:
    event = await db.get(Event, content_id)
    if not event:
        return None

    review = Review(
        user_id=user_id,
        content_id=content_id,
        content=content,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


async def update_review(
    db: AsyncSession,
    review_id: int,
    user_id: int,
    content: Optional[str],
) -> Review | None:
    stmt = select(Review).where(Review.review_id == review_id, Review.user_id == user_id)
    review = (await db.execute(stmt)).scalar_one_or_none()
    if not review:
        return None

    if content is not None:
        review.content = content


    await db.commit()
    await db.refresh(review)
    return review


async def delete_review(db: AsyncSession, review_id: int, user_id: int) -> bool:
    stmt = select(Review).where(Review.review_id == review_id, Review.user_id == user_id)
    review = (await db.execute(stmt)).scalar_one_or_none()
    if not review:
        return False

    await db.delete(review)
    await db.commit()
    return True
