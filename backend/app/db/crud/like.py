from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.event import Event
from app.db.models.like import Like


async def is_liked(db: AsyncSession, user_id: int, content_id: int) -> bool:
    stmt = select(Like).where(Like.user_id == user_id, Like.content_id == content_id)
    like_obj = (await db.execute(stmt)).scalar_one_or_none()
    return like_obj is not None


async def toggle_like(db: AsyncSession, user_id: int, content_id: int) -> dict | None:
    event = await db.get(Event, content_id)
    if not event:
        return None

    stmt = select(Like).where(Like.user_id == user_id, Like.content_id == content_id)
    like_obj = (await db.execute(stmt)).scalar_one_or_none()

    current_count = event.like_count or 0

    if like_obj:
        await db.delete(like_obj)
        event.like_count = max(0, current_count - 1)
        liked = False
    else:
        db.add(Like(user_id=user_id, content_id=content_id))
        event.like_count = current_count + 1
        liked = True

    await db.commit()
    await db.refresh(event)

    return {
        "content_id": content_id,
        "like_count": event.like_count or 0,
        "liked": liked,
    }
