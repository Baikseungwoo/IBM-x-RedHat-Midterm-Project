from datetime import date
from decimal import Decimal
from typing import Sequence

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.course import Course
from app.db.models.course_detail import CourseItem
from app.db.models.event import Event


def _to_float(value: Decimal | float | None) -> float | None:
    if value is None:
        return None
    return float(value)


async def list_recommendation_candidates(
    db: AsyncSession,
    region: str,
    target_date: date,
    keyword: str,
    limit: int = 50,
) -> list[dict]:
    stmt = select(Event).where(
        and_(
            Event.region == region,
            Event.start_date <= target_date,
            Event.end_date >= target_date,
        )
    )

    kw = keyword.strip()
    if kw:
        stmt = stmt.where(Event.title.ilike(f"%{kw}%"))

    stmt = stmt.order_by(
        Event.like_count.desc(),
        Event.bookmark_count.desc(),
        Event.start_date.asc(),
    ).limit(limit)

    events = (await db.execute(stmt)).scalars().all()

    return [
        {
            "content_id": e.content_id,
            "title": e.title,
            "first_image": e.first_image,
            "addr1": e.addr1,
            "addr2": e.addr2,
            "start_date": e.start_date,
            "end_date": e.end_date,
            "mapx": _to_float(e.mapx),
            "mapy": _to_float(e.mapy),
        }
        for e in events
    ]


async def create_course_with_items(
    db: AsyncSession,
    user_id: int,
    region: str,
    course_title: str,
    description: str,
    target_date: date,
    keyword: str,
    items: Sequence[dict],  # [{"content_id": int, "sequence": int}, ...]
) -> Course | None:
    if not items:
        return None

    content_ids = [item["content_id"] for item in items]
    rows = await db.execute(select(Event.content_id).where(Event.content_id.in_(content_ids)))
    existing_ids = {row[0] for row in rows.all()}

    if len(existing_ids) != len(set(content_ids)):
        return None

    course = Course(
        user_id=user_id,
        region=region,
        course_title=course_title,
        description=description,
        date=target_date,
        keyword=keyword,
    )
    db.add(course)
    await db.flush()  # course_id 확보

    course_items = [
        CourseItem(
            course_id=course.course_id,
            content_id=item["content_id"],
            sequence=item["sequence"],
        )
        for item in items
    ]
    db.add_all(course_items)

    await db.commit()
    await db.refresh(course)
    return course


async def list_my_courses(db: AsyncSession, user_id: int) -> list[dict]:
    stmt = (
        select(Course)
        .where(Course.user_id == user_id)
        .order_by(Course.created_at.desc(), Course.course_id.desc())
    )
    courses = (await db.execute(stmt)).scalars().all()

    return [
        {
            "course_id": c.course_id,
            "region": c.region,
            "course_title": c.course_title,
            "description": c.description,
            "date": c.date,
            "keyword": c.keyword,
            "created_at": c.created_at,
        }
        for c in courses
    ]


async def delete_my_course(db: AsyncSession, user_id: int, course_id: int) -> bool:
    stmt = select(Course).where(Course.course_id == course_id, Course.user_id == user_id)
    course = (await db.execute(stmt)).scalar_one_or_none()
    if not course:
        return False

    await db.delete(course)
    await db.commit()
    return True


async def list_course_items(db: AsyncSession, course_id: int) -> list[dict]:
    stmt = (
        select(CourseItem, Event)
        .join(Event, Event.content_id == CourseItem.content_id)
        .where(CourseItem.course_id == course_id)
        .order_by(CourseItem.sequence.asc())
    )
    rows = (await db.execute(stmt)).all()

    return [
        {
            "course_item_id": item.course_item_id,
            "course_id": item.course_id,
            "content_id": item.content_id,
            "sequence": item.sequence,
            "title": event.title,
            "first_image": event.first_image,
            "addr1": event.addr1,
            "addr2": event.addr2,
            "start_date": event.start_date,
            "end_date": event.end_date,
            "mapx": _to_float(event.mapx),
            "mapy": _to_float(event.mapy),
        }
        for item, event in rows
    ]
