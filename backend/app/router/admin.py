from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_admin_user_id
from app.db.database import get_db
from app.db.scheme.inquiry import InquiryReplyRequest, InquiryListResponse
from app.service.inquiry import list_admin_inquiries_service, reply_inquiry_service

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/inquiries", response_model=InquiryListResponse)
async def list_admin_inquiries(
    admin_id: int = Depends(get_admin_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await list_admin_inquiries_service(db)


@router.patch("/inquiries/{inquiry_id}/reply")
async def reply_inquiry(
    inquiry_id: int,
    payload: InquiryReplyRequest,
    admin_id: int = Depends(get_admin_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await reply_inquiry_service(db, inquiry_id, payload)
