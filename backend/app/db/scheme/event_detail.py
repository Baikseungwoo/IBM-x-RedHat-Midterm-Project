from typing import Optional
from pydantic import BaseModel, ConfigDict


# 이벤트 상세 생성 요청
class EventDetailCreate(BaseModel):
    event_detail_event_id: int
    event_detail_description: Optional[str] = None
    event_detail_address: Optional[str] = None
    event_detail_contact: Optional[str] = None
    event_detail_host: Optional[str] = None
    event_detail_notice: Optional[str] = None
    event_detail_sub_event: Optional[str] = None


# 이벤트 상세 수정 요청
class EventDetailUpdate(BaseModel):
    event_detail_description: Optional[str] = None
    event_detail_address: Optional[str] = None
    event_detail_contact: Optional[str] = None
    event_detail_host: Optional[str] = None
    event_detail_notice: Optional[str] = None
    event_detail_sub_event: Optional[str] = None


# 이벤트 상세 응답
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