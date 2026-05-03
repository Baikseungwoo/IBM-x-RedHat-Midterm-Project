from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_user_id, get_admin_user_id
from app.db.database import get_db
from app.db.scheme.inquiry import (
    InquiryCreateRequest,
    InquiryReplyRequest,
    InquiryListResponse,
)
from app.service.inquiry import (
    create_inquiry_service,
    list_my_inquiries_service,
    list_admin_inquiries_service,
    reply_inquiry_service,
)

router = APIRouter(prefix="/api/inquiries", tags=["Inquiry"])


@router.post("")
async def create_inquiry(
    payload: InquiryCreateRequest,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await create_inquiry_service(db, user_id, payload)


@router.get("/me", response_model=InquiryListResponse)
async def list_my_inquiries(
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await list_my_inquiries_service(db, user_id)
