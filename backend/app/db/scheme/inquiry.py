from datetime import datetime
from pydantic import BaseModel, ConfigDict


class InquiryCreateRequest(BaseModel):
    title: str
    content: str


class InquiryReplyRequest(BaseModel):
    admin_reply: str


class InquiryResponse(BaseModel):
    inquiry_id: int
    user_id: int
    user_nickname: str | None = None
    title: str
    content: str
    status: str
    admin_reply: str | None = None
    created_at: datetime
    answered_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class InquiryListResponse(BaseModel):
    success: bool
    inquiries: list[InquiryResponse]
