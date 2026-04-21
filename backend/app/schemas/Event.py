from typing import Optional
from pydantic import BaseModel, ConfigDict


# event 생성 요청
class EventCreate(BaseModel):
    title: str
    content_id: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    place: Optional[str] = None
    target: Optional[str] = None
    fee: Optional[str] = None
    thumbnail: Optional[str] = None


# event 응답
class EventResponse(BaseModel):
    id: int
    title: str
    content_id: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    place: Optional[str] = None
    target: Optional[str] = None
    fee: Optional[str] = None
    thumbnail: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# event_detail 생성 요청
class EventDetailCreate(BaseModel):
    event_id: int
    description: Optional[str] = None
    address: Optional[str] = None
    contact: Optional[str] = None
    host: Optional[str] = None
    notice: Optional[str] = None
    sub_event: Optional[str] = None


# event_detail 수정 요청
class EventDetailUpdate(BaseModel):
    description: Optional[str] = None
    address: Optional[str] = None
    contact: Optional[str] = None
    host: Optional[str] = None
    notice: Optional[str] = None
    sub_event: Optional[str] = None


# event_detail 응답
class EventDetailResponse(BaseModel):
    id: int
    event_id: int
    description: Optional[str] = None
    address: Optional[str] = None
    contact: Optional[str] = None
    host: Optional[str] = None
    notice: Optional[str] = None
    sub_event: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
