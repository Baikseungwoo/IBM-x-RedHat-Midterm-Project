from datetime import date
from typing import Optional

from pydantic import BaseModel


class EventTopItem(BaseModel):
    content_id: int
    title: str
    region: Optional[str] = None
    first_image: Optional[str] = None
    start_date: date
    end_date: date
    like_count: int
    is_liked: bool = False
    is_bookmarked: bool = False


class EventListItem(BaseModel):
    content_id: int
    title: str
    region: Optional[str] = None
    first_image: Optional[str] = None
    start_date: date
    end_date: date
    status: Optional[str] = None
    like_count: int
    bookmark_count: int
    is_liked: bool = False
    is_bookmarked: bool = False


class EventSearchItem(BaseModel):
    content_id: int
    title: str
    region: Optional[str] = None
    first_image: Optional[str] = None
    start_date: date
    end_date: date
    is_liked: bool = False
    is_bookmarked: bool = False


class EventAutocompleteItem(BaseModel):
    content_id: int
    title: str
    region: Optional[str] = None
    thumbnail: Optional[str] = None


class EventDetailData(BaseModel):
    content_id: int
    title: str
    addr1: Optional[str] = None
    addr2: Optional[str] = None
    region: Optional[str] = None
    zipcode: Optional[str] = None
    start_date: date
    end_date: date
    tel: Optional[str] = None
    mapx: Optional[float] = None
    mapy: Optional[float] = None
    first_image: Optional[str] = None
    first_image2: Optional[str] = None
    lclsSystm3: Optional[str] = None
    status: Optional[str] = None
    like_count: int
    bookmark_count: int
    event_homepage: Optional[str] = None
    play_time: Optional[str] = None
    program: Optional[str] = None
    sponsor1: Optional[str] = None
    sponsor1_tel: Optional[str] = None


class RegionTopResponse(BaseModel):
    success: bool
    events: list[EventTopItem]


class TopResponse(BaseModel):
    success: bool
    events: list[EventTopItem]


class EventDetailResponse(BaseModel):
    success: bool
    event: EventDetailData


class SearchResponse(BaseModel):
    success: bool
    events: list[EventSearchItem]


class EventListResponse(BaseModel):
    success: bool
    events: list[EventListItem]


class CategoryItem(BaseModel):
    lclsSystm3: str


class CategoriesResponse(BaseModel):
    success: bool
    categories: list[CategoryItem]


class AutocompleteResponse(BaseModel):
    success: bool
    events: list[EventAutocompleteItem]
