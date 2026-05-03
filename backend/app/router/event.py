from datetime import date
from typing import Optional
from app.core.auth import get_optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.scheme.event import (
    AutocompleteResponse,
    CategoriesResponse,
    EventDetailResponse,
    EventListResponse,
    RegionTopResponse,
    SearchResponse,
    TopResponse,
)
from app.service.event import (
    autocomplete_events,
    filter_events,
    get_event_detail,
    get_region_top_events,
    get_top_events,
    list_categories,
    list_events,
    search_events,
)

router = APIRouter(prefix="/api", tags=["Event"])


@router.get("/events/regions/{region}/top", response_model=RegionTopResponse)
async def api_region_top(
    region: str,
    user_id: Optional[int] = Depends(get_optional),
    db: AsyncSession = Depends(get_db),
):
    return await get_region_top_events(db, region, user_id)


@router.get("/events/top", response_model=TopResponse)
async def api_top(
    user_id: Optional[int] = Depends(get_optional),
    db: AsyncSession = Depends(get_db),
):
    return await get_top_events(db, user_id)


@router.get("/search", response_model=SearchResponse)
async def api_search(
    keyword: str = Query(..., min_length=1),
    user_id: Optional[int] = Depends(get_optional),
    db: AsyncSession = Depends(get_db),
):
    return await search_events(db, keyword, user_id)


@router.get("/events", response_model=EventListResponse)
async def api_events(
    user_id: Optional[int] = Depends(get_optional),
    db: AsyncSession = Depends(get_db),
):
    return await list_events(db, user_id)


@router.get("/events/filter", response_model=EventListResponse)
async def api_events_filter(
    region: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    lclsSystm3: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    keyword: Optional[str] = Query(None),
    user_id: Optional[int] = Depends(get_optional),
    db: AsyncSession = Depends(get_db),
):
    return await filter_events(
        db=db,
        region=region,
        status=status,
        lcls_systm3=lclsSystm3,
        start_date_param=start_date,
        end_date_param=end_date,
        keyword=keyword,
        user_id=user_id,
    )


@router.get("/categories", response_model=CategoriesResponse)
async def api_categories(db: AsyncSession = Depends(get_db)):
    return await list_categories(db)


@router.get("/events/autocomplete", response_model=AutocompleteResponse)
async def api_autocomplete(
    keyword: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
):
    return await autocomplete_events(db, keyword)


@router.get("/events/{content_id}", response_model=EventDetailResponse)
async def api_event_detail(content_id: int, db: AsyncSession = Depends(get_db)):
    return await get_event_detail(db, content_id)
