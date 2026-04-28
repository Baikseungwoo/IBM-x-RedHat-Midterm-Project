from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.crud.bookmark import (
    delete_my_bookmark,
    is_bookmarked,
    list_my_bookmarks,
    toggle_bookmark,
)
from app.db.models.event import Event


async def toggle_bookmark_service(db: AsyncSession, user_id: int, content_id: int) -> dict:
    result = await toggle_bookmark(db, user_id, content_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Event not found")

    return {"success": True, **result}


async def get_bookmark_me_service(db: AsyncSession, user_id: int, content_id: int) -> dict:
    event = await db.get(Event, content_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    bookmarked = await is_bookmarked(db, user_id, content_id)
    return {"success": True, "content_id": content_id, "bookmarked": bookmarked}


async def list_my_bookmarks_service(db: AsyncSession, user_id: int) -> dict:
    events = await list_my_bookmarks(db, user_id)
    return {"success": True, "events": events}


async def delete_my_bookmark_service(db: AsyncSession, user_id: int, content_id: int) -> dict:
    deleted = await delete_my_bookmark(db, user_id, content_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Event not found")
    if deleted is False:
        raise HTTPException(status_code=404, detail="Bookmark not found")

    return {"success": True, "content_id": content_id}
