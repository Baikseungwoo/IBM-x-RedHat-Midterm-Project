from __future__ import annotations

import math
import logging
from datetime import date, datetime, timedelta
from decimal import Decimal, InvalidOperation

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.event import Event
from app.db.models.event_detail import EventDetail
from app.external.public.client import fetch_detail_intro, fetch_festival_page

logger = logging.getLogger(__name__)


ALL_AREA_CODES = {
    "1", "2", "3", "4", "5", "6", "7", "8",
    "31", "32", "33", "34", "35", "36", "37", "38", "39",
}

AREA_TO_REGION_10 = {
    "1": "서울",
    "2": "경기도", "31": "경기도",
    "32": "강원도",
    "33": "충청북도",
    "34": "충청남도", "3": "충청남도", "8": "충청남도",
    "37": "전라북도",
    "38": "전라남도", "5": "전라남도",
    "35": "경상북도", "4": "경상북도",
    "36": "경상남도", "6": "경상남도", "7": "경상남도",
    "39": "제주도",
}


def _validate_region_mapping() -> None:
    missing = ALL_AREA_CODES - set(AREA_TO_REGION_10.keys())
    if missing:
        raise RuntimeError(f"region 매핑 누락 areaCode: {sorted(missing)}")


def _region_10(item: dict) -> str:
    area = _clean(item.get("areacode"))
    if area in AREA_TO_REGION_10:
        return AREA_TO_REGION_10[area]

    # areacode 누락 시 addr1 보조 판별
    addr1 = _clean(item.get("addr1")) or ""
    if "서울" in addr1:
        return "서울"
    if "경기" in addr1 or "인천" in addr1:
        return "경기도"
    if "강원" in addr1:
        return "강원도"
    if "충북" in addr1 or "충청북" in addr1:
        return "충청북도"
    if "충남" in addr1 or "충청남" in addr1 or "대전" in addr1 or "세종" in addr1:
        return "충청남도"
    if "전북" in addr1 or "전라북" in addr1:
        return "전라북도"
    if "전남" in addr1 or "전라남" in addr1 or "광주" in addr1:
        return "전라남도"
    if "경북" in addr1 or "경상북" in addr1 or "대구" in addr1:
        return "경상북도"
    if "경남" in addr1 or "경상남" in addr1 or "부산" in addr1 or "울산" in addr1:
        return "경상남도"
    if "제주" in addr1:
        return "제주도"

    raise ValueError(f"지역 분류 실패: areacode={area}, addr1={addr1}, contentid={item.get('contentid')}")



def _clean(value: str | None) -> str | None:
    if value is None:
        return None
    v = str(value).strip()
    return v if v else None


def _to_int(value: str | None) -> int | None:
    v = _clean(value)
    if v is None:
        return None
    try:
        return int(v)
    except ValueError:
        return None


def _to_decimal(value: str | None) -> Decimal | None:
    v = _clean(value)
    if v is None:
        return None
    try:
        return Decimal(v)
    except (InvalidOperation, ValueError):
        return None


def _to_date(value: str | None) -> date | None:
    v = _clean(value)
    if v is None:
        return None
    try:
        return datetime.strptime(v, "%Y%m%d").date()
    except ValueError:
        return None


def _derive_status(start_date: date, end_date: date, today: date | None = None) -> str:
    ref = today or date.today()
    if ref < start_date:
        return "진행전"
    if ref > end_date:
        return "진행완료"
    return "진행중"


def _map_event(item: dict) -> dict | None:
    content_id = _to_int(item.get("contentid"))
    content_type_id = _to_int(item.get("contenttypeid"))
    title = _clean(item.get("title"))
    start_date = _to_date(item.get("eventstartdate"))
    end_date = _to_date(item.get("eventenddate"))

    # 필수값 없으면 버림
    if (
    content_id is None
    or content_type_id is None
    or title is None
    or start_date is None
    or end_date is None
    ):
        return None

    return {
        "content_id": content_id,
        "content_type_id": content_type_id,
        "title": title,
        "addr1": _clean(item.get("addr1")),
        "addr2": _clean(item.get("addr2")),
        "region": _region_10(item),
        "zipcode": _clean(item.get("zipcode")),
        "start_date": start_date,
        "end_date": end_date,
        "tel": _clean(item.get("tel")),
        "mapx": _to_decimal(item.get("mapx")),
        "mapy": _to_decimal(item.get("mapy")),
        "first_image": _clean(item.get("firstimage")),
        "first_image2": _clean(item.get("firstimage2")),
        "lcls_systm3": _clean(item.get("lclsSystm3")) or _clean(item.get("cat3")),
        "status": _derive_status(start_date, end_date),
    }


def _map_event_detail(item: dict, content_id: int) -> dict:
    # 값 있는 것만 넣기
    detail = {"content_id": content_id}

    mapping = {
        "event_place": item.get("eventplace"),
        "event_homepage": item.get("eventhomepage"),
        "play_time": item.get("playtime"),
        "use_time_festival": item.get("usetimefestival"),
        "spend_time_festival": item.get("spendtimefestival"),
        "booking_place": item.get("bookingplace"),
        "age_limit": item.get("agelimit"),
        "place_info": item.get("placeinfo"),
        "program": item.get("program"),
        "sub_event": item.get("subevent"),
        "sponsor1": item.get("sponsor1"),
        "sponsor1_tel": item.get("sponsor1tel"),
        "sponsor2": item.get("sponsor2"),
        "sponsor2_tel": item.get("sponsor2tel"),
    }

    for key, value in mapping.items():
        cleaned = _clean(value)
        if cleaned is not None:
            detail[key] = cleaned

    return detail


async def sync_events_service(
    db: AsyncSession,
    page: int = 1,
    size: int = 100,
    event_start_date: str | None = None,  # YYYYMMDD
    event_end_date: str | None = None,    # YYYYMMDD
) -> dict:
    items, total_count = await fetch_festival_page(
        page_no=page,
        num_of_rows=size,
        event_start_date=event_start_date,
        event_end_date=event_end_date,
    )

    fetched = len(items)
    skipped = 0
    event_saved = 0
    detail_saved = 0

    for item in items:
        event_row = _map_event(item)
        if event_row is None:
            skipped += 1
            continue

        content_id = event_row["content_id"]

        # Event upsert (PK=content_id)
        event_obj = await db.get(Event, content_id)
        if event_obj is None:
            db.add(Event(**event_row))
        else:
            for k, v in event_row.items():
                if k != "content_id":
                    setattr(event_obj, k, v)
        event_saved += 1

        # event 유효할 때만 detail 조회
        try:
            detail_item = await fetch_detail_intro(
                content_id=content_id,
                content_type_id=event_row["content_type_id"],
            )
        except (httpx.HTTPError, RuntimeError) as exc:
            logger.warning(
                "event detail fetch skipped: content_id=%s, content_type_id=%s, error=%s",
                content_id,
                event_row["content_type_id"],
                exc,
            )
            continue
        if detail_item is None:
            continue

        detail_row = _map_event_detail(detail_item, content_id)

        # detail_content_id 외 값이 없으면 저장 안 함
        if len(detail_row) == 1:
            continue

        result = await db.execute(
            select(EventDetail).where(EventDetail.content_id == content_id)
        )
        detail_obj = result.scalar_one_or_none()

        if detail_obj is None:
            db.add(EventDetail(**detail_row))
        else:
            for k, v in detail_row.items():
                if k != "content_id":
                    setattr(detail_obj, k, v)
        detail_saved += 1

    await db.commit()

    return {
        "success": True,
        "page": page,
        "size": size,
        "total_count": total_count,
        "fetched": fetched,
        "skipped": skipped,
        "event_saved": event_saved,
        "detail_saved": detail_saved,
    }


async def sync_recent_and_upcoming_events_service(
    db: AsyncSession,
    size: int = 100,
) -> dict:
    
    _validate_region_mapping()

    # 오늘 기준 1달(30일) 전부터 이후 축제 모두
    from_date = (date.today() - timedelta(days=30)).strftime("%Y%m%d")
    to_date = "20991231"

    # 총 페이지 계산용 1페이지 조회
    _, total_count = await fetch_festival_page(
        page_no=1,
        num_of_rows=size,
        event_start_date=from_date,
        event_end_date=to_date,
    )

    total_pages = math.ceil(total_count / size) if total_count > 0 else 0

    merged = {
        "success": True,
        "from_date": from_date,
        "to_date": to_date,
        "total_count": total_count,
        "pages": total_pages,
        "fetched": 0,
        "skipped": 0,
        "event_saved": 0,
        "detail_saved": 0,
    }

    for page in range(1, total_pages + 1):
        result = await sync_events_service(
            db=db,
            page=page,
            size=size,
            event_start_date=from_date,
            event_end_date=to_date,
        )
        merged["fetched"] += result["fetched"]
        merged["skipped"] += result["skipped"]
        merged["event_saved"] += result["event_saved"]
        merged["detail_saved"] += result["detail_saved"]

    return merged
