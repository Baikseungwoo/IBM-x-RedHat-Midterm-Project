from typing import Optional
from pydantic import BaseModel, ConfigDict


# event 생성 요청
class EventCreate(BaseModel):
    event_title: str
    event_content_id: int
    event_start_date: Optional[str] = None
    event_end_date: Optional[str] = None
    event_place: Optional[str] = None
    event_target: Optional[str] = None
    event_fee: Optional[str] = None
    event_thumbnail: Optional[str] = None


# event 수정 요청
class EventUpdate(BaseModel):
    event_title: Optional[str] = None
    event_content_id: Optional[int] = None
    event_start_date: Optional[str] = None
    event_end_date: Optional[str] = None
    event_place: Optional[str] = None
    event_target: Optional[str] = None
    event_fee: Optional[str] = None
    event_thumbnail: Optional[str] = None


# event 응답
class EventResponse(BaseModel):
    event_id: int
    event_title: str
    event_content_id: int
    event_start_date: Optional[str] = None
    event_end_date: Optional[str] = None
    event_place: Optional[str] = None
    event_target: Optional[str] = None
    event_fee: Optional[str] = None
    event_thumbnail: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# event_detail 생성 요청
class EventDetailCreate(BaseModel):
    event_detail_event_id: int
    event_detail_description: Optional[str] = None
    event_detail_address: Optional[str] = None
    event_detail_contact: Optional[str] = None
    event_detail_host: Optional[str] = None
    event_detail_notice: Optional[str] = None
    event_detail_sub_event: Optional[str] = None


# event_detail 수정 요청
class EventDetailUpdate(BaseModel):
    event_detail_description: Optional[str] = None
    event_detail_address: Optional[str] = None
    event_detail_contact: Optional[str] = None
    event_detail_host: Optional[str] = None
    event_detail_notice: Optional[str] = None
    event_detail_sub_event: Optional[str] = None


# event_detail 응답
class EventDetailResponse(BaseModel):
    event_detail_id: int
    event_detail_event_id: int
    event_detail_description: Optional[str] = None
    event_detail_address: Optional[str] = None
    event_detail_contact: Optional[str] = None
    event_detail_host: Optional[str] = None
    event_detail_notice: Optional[str] = None
    event_detail_sub_event: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)