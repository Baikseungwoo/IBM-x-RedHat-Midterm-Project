from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.crud.inquiry import (
    create_inquiry,
    get_my_inquiries,
    get_all_inquiries,
    get_inquiry_by_id,
)
from app.db.crud.notification import create_notification
from app.db.scheme.inquiry import InquiryCreateRequest, InquiryReplyRequest


def _inquiry_payload(inquiry) -> dict:
    return {
        "inquiry_id": inquiry.inquiry_id,
        "user_id": inquiry.user_id,
        "user_nickname": inquiry.user_nickname,
        "title": inquiry.title,
        "content": inquiry.content,
        "status": inquiry.status,
        "admin_reply": inquiry.admin_reply,
        "created_at": inquiry.created_at,
        "answered_at": inquiry.answered_at,
    }


async def create_inquiry_service(db: AsyncSession, user_id: int, payload: InquiryCreateRequest):
    inquiry = await create_inquiry(db, user_id, payload.title, payload.content)
    return {"success": True, "inquiry": _inquiry_payload(inquiry)}


async def list_my_inquiries_service(db: AsyncSession, user_id: int):
    inquiries = await get_my_inquiries(db, user_id)
    return {"success": True, "inquiries": [_inquiry_payload(inquiry) for inquiry in inquiries]}


async def list_admin_inquiries_service(db: AsyncSession):
    inquiries = await get_all_inquiries(db)
    return {"success": True, "inquiries": [_inquiry_payload(inquiry) for inquiry in inquiries]}


async def reply_inquiry_service(db: AsyncSession, inquiry_id: int, payload: InquiryReplyRequest):
    inquiry = await get_inquiry_by_id(db, inquiry_id)

    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    user_nickname = inquiry.user_nickname
    inquiry.admin_reply = payload.admin_reply
    inquiry.status = "answered"
    inquiry.answered_at = datetime.now()

    await create_notification(
        db=db,
        user_id=inquiry.user_id,
        title="Inquiry reply submitted",
        message=payload.admin_reply,
    )

    await db.commit()
    await db.refresh(inquiry)

    return {
        "success": True,
        "inquiry": {
            "inquiry_id": inquiry.inquiry_id,
            "user_id": inquiry.user_id,
            "user_nickname": user_nickname,
            "title": inquiry.title,
            "content": inquiry.content,
            "status": inquiry.status,
            "admin_reply": inquiry.admin_reply,
            "created_at": inquiry.created_at,
            "answered_at": inquiry.answered_at,
        },
    }
