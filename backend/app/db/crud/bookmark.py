from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.bookmark import Bookmark
from app.db.models.event import Event


async def is_bookmarked(db: AsyncSession, user_id: int, content_id: int) -> bool:
    stmt = select(Bookmark).where(
        Bookmark.user_id == user_id,
        Bookmark.content_id == content_id,
    )
    bookmark = (await db.execute(stmt)).scalar_one_or_none()
    return bookmark is not None


async def toggle_bookmark(db: AsyncSession, user_id: int, content_id: int) -> dict | None:
    event = await db.get(Event, content_id)
    if not event:
        return None

    stmt = select(Bookmark).where(
        Bookmark.user_id == user_id,
        Bookmark.content_id == content_id,
    )
    bookmark = (await db.execute(stmt)).scalar_one_or_none()

    current_count = event.bookmark_count or 0

    if bookmark:
        await db.delete(bookmark)
        event.bookmark_count = max(0, current_count - 1)
        bookmarked = False
    else:
        db.add(Bookmark(user_id=user_id, content_id=content_id))
        event.bookmark_count = current_count + 1
        bookmarked = True

    await db.commit()
    await db.refresh(event)

    return {
        "content_id": content_id,
        "bookmark_count": event.bookmark_count or 0,
        "bookmarked": bookmarked,
    }


async def list_my_bookmarks(db: AsyncSession, user_id: int) -> list[dict]:
    stmt = (
        select(
            Bookmark.bookmark_id,
            Event.content_id,
            Event.title,
            Event.region,
            Event.first_image,
            Event.start_date,
            Event.end_date,
            Event.bookmark_count,
            Bookmark.created_at,
        )
        .join(Event, Event.content_id == Bookmark.content_id)
        .where(Bookmark.user_id == user_id)
        .order_by(Bookmark.created_at.desc())
    )
    rows = (await db.execute(stmt)).all()

    return [
        {
            "bookmark_id": r.bookmark_id,
            "content_id": r.content_id,
            "title": r.title,
            "region": r.region,
            "first_image": r.first_image,
            "start_date": r.start_date,
            "end_date": r.end_date,
            "bookmark_count": r.bookmark_count or 0,
            "created_at": r.created_at,
        }
        for r in rows
    ]


async def delete_my_bookmark(db: AsyncSession, user_id: int, content_id: int) -> bool | None:
    event = await db.get(Event, content_id)
    if not event:
        return None

    stmt = select(Bookmark).where(
        Bookmark.user_id == user_id,
        Bookmark.content_id == content_id,
    )
    bookmark = (await db.execute(stmt)).scalar_one_or_none()
    if not bookmark:
        return False

    await db.delete(bookmark)
    event.bookmark_count = max(0, (event.bookmark_count or 0) - 1)
    await db.commit()
    return True
