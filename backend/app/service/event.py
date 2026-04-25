from datetime import date
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.event import Event
from app.db.models.event_detail import EventDetail


def _ongoing_condition(today: date):
    return and_(Event.start_date <= today, Event.end_date >= today)


def _top_item(e: Event) -> dict:
    return {
        "content_id": e.content_id,
        "title": e.title,
        "region": e.region,
        "first_image": e.first_image,
        "start_date": e.start_date,
        "end_date": e.end_date,
        "like_count": e.like_count or 0,
    }


def _list_item(e: Event) -> dict:
    return {
        "content_id": e.content_id,
        "title": e.title,
        "region": e.region,
        "first_image": e.first_image,
        "start_date": e.start_date,
        "end_date": e.end_date,
        "status": e.status,
        "like_count": e.like_count or 0,
        "bookmark_count": e.bookmark_count or 0,
    }


def _search_item(e: Event) -> dict:
    return {
        "content_id": e.content_id,
        "title": e.title,
        "region": e.region,
        "first_image": e.first_image,
        "start_date": e.start_date,
        "end_date": e.end_date,
    }


async def get_region_top_events(db: AsyncSession, region: str) -> dict:
    today = date.today()
    stmt = (
        select(Event)
        .where(and_(Event.region == region, _ongoing_condition(today)))
        .order_by(Event.like_count.desc(), Event.start_date.asc())
        .limit(3)
    )
    rows = (await db.execute(stmt)).scalars().all()
    return {"success": True, "events": [_top_item(e) for e in rows]}


async def get_top_events(db: AsyncSession) -> dict:
    today = date.today()
    stmt = (
        select(Event)
        .where(_ongoing_condition(today))
        .order_by(Event.like_count.desc(), Event.start_date.asc())
        .limit(10)
    )
    rows = (await db.execute(stmt)).scalars().all()
    return {"success": True, "events": [_top_item(e) for e in rows]}


async def get_event_detail(db: AsyncSession, content_id: int) -> dict:
    stmt = (
        select(Event, EventDetail)
        .outerjoin(EventDetail, EventDetail.content_id == Event.content_id)
        .where(Event.content_id == content_id)
    )
    row = (await db.execute(stmt)).first()
    if not row:
        raise HTTPException(status_code=404, detail="Event not found")

    event, detail = row
    data = {
        "content_id": event.content_id,
        "title": event.title,
        "addr1": event.addr1,
        "addr2": event.addr2,
        "region": event.region,
        "zipcode": event.zipcode,
        "start_date": event.start_date,
        "end_date": event.end_date,
        "tel": event.tel,
        "mapx": float(event.mapx) if event.mapx is not None else None,
        "mapy": float(event.mapy) if event.mapy is not None else None,
        "first_image": event.first_image,
        "first_image2": event.first_image2,
        "lclsSystm3": event.lcls_systm3,
        "status": event.status,
        "like_count": event.like_count or 0,
        "bookmark_count": event.bookmark_count or 0,
        "event_homepage": detail.event_homepage if detail else None,
        "play_time": detail.play_time if detail else None,
        "program": detail.program if detail else None,
        "sponsor1": detail.sponsor1 if detail else None,
        "sponsor1_tel": detail.sponsor1_tel if detail else None,
    }
    return {"success": True, "event": data}


async def search_events(db: AsyncSession, keyword: str) -> dict:
    kw = keyword.strip()
    if not kw:
        return {"success": True, "events": []}

    stmt = (
        select(Event)
        .where(Event.title.ilike(f"%{kw}%"))
        .order_by(Event.like_count.desc(), Event.start_date.asc())
        .limit(50)
    )
    rows = (await db.execute(stmt)).scalars().all()
    return {"success": True, "events": [_search_item(e) for e in rows]}


async def list_events(db: AsyncSession) -> dict:
    stmt = select(Event).order_by(Event.start_date.desc(), Event.content_id.desc())
    rows = (await db.execute(stmt)).scalars().all()
    return {"success": True, "events": [_list_item(e) for e in rows]}


async def filter_events(
    db: AsyncSession,
    region: Optional[str] = None,
    status: Optional[str] = None,
    lcls_systm3: Optional[str] = None,
    start_date_param: Optional[date] = None,
    end_date_param: Optional[date] = None,
    keyword: Optional[str] = None,
) -> dict:
    stmt = select(Event)

    if region:
        stmt = stmt.where(Event.region == region)

    if lcls_systm3:
        stmt = stmt.where(Event.lcls_systm3 == lcls_systm3)

    if keyword:
        stmt = stmt.where(Event.title.ilike(f"%{keyword.strip()}%"))

    today = date.today()
    if status == "진행중":
        stmt = stmt.where(and_(Event.start_date <= today, Event.end_date >= today))
    elif status == "예정":
        stmt = stmt.where(Event.start_date > today)
    elif status == "종료":
        stmt = stmt.where(Event.end_date < today)
    elif status:
        stmt = stmt.where(Event.status == status)

    if start_date_param and end_date_param:
        stmt = stmt.where(
            and_(Event.start_date <= end_date_param, Event.end_date >= start_date_param)
        )
    elif start_date_param:
        stmt = stmt.where(Event.end_date >= start_date_param)
    elif end_date_param:
        stmt = stmt.where(Event.start_date <= end_date_param)

    stmt = stmt.order_by(Event.start_date.desc(), Event.content_id.desc())
    rows = (await db.execute(stmt)).scalars().all()
    return {"success": True, "events": [_list_item(e) for e in rows]}


async def list_categories(db: AsyncSession) -> dict:
    stmt = (
        select(Event.lcls_systm3)
        .where(and_(Event.lcls_systm3.is_not(None), Event.lcls_systm3 != ""))
        .distinct()
        .order_by(Event.lcls_systm3.asc())
    )
    rows = (await db.execute(stmt)).all()
    categories = [{"lclsSystm3": r[0]} for r in rows]
    return {"success": True, "categories": categories}


async def autocomplete_events(db: AsyncSession, keyword: str) -> dict:
    kw = keyword.strip()
    if not kw:
        return {"success": True, "events": []}

    stmt = (
        select(Event.content_id, Event.title)
        .where(Event.title.ilike(f"%{kw}%"))
        .order_by(Event.like_count.desc(), Event.title.asc())
        .limit(10)
    )
    rows = (await db.execute(stmt)).all()
    events = [{"content_id": r[0], "title": r[1]} for r in rows]
    return {"success": True, "events": events}
