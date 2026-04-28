from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.crud.like import is_liked, toggle_like
from app.db.models.event import Event


async def toggle_like_service(db: AsyncSession, user_id: int, content_id: int) -> dict:
    result = await toggle_like(db, user_id, content_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Event not found")

    return {"success": True, **result}


async def get_like_me_service(db: AsyncSession, user_id: int, content_id: int) -> dict:
    event = await db.get(Event, content_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    liked = await is_liked(db, user_id, content_id)
    return {"success": True, "content_id": content_id, "liked": liked}
