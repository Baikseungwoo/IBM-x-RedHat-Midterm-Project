from typing import Optional
from pydantic import BaseModel, ConfigDict


# 이벤트 상세 생성 요청
class EventDetailCreate(BaseModel):
    event_id: int
    description: Optional[str] = None
    address: Optional[str] = None
    contact: Optional[str] = None
    host: Optional[str] = None
    notice: Optional[str] = None
    sub_event: Optional[str] = None


# 이벤트 상세 응답
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
