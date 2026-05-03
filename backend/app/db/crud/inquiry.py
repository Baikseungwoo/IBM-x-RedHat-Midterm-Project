from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.db.models.inquiry import Inquiry


async def create_inquiry(db: AsyncSession, user_id: int, title: str, content: str):
    inquiry = Inquiry(user_id=user_id, title=title, content=content)
    db.add(inquiry)
    await db.commit()
    await db.refresh(inquiry)
    return inquiry


async def get_my_inquiries(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Inquiry)
        .options(selectinload(Inquiry.user))
        .where(Inquiry.user_id == user_id)
        .order_by(Inquiry.created_at.desc())
    )
    return result.scalars().all()


async def get_all_inquiries(db: AsyncSession):
    result = await db.execute(
        select(Inquiry)
        .options(selectinload(Inquiry.user))
        .order_by(Inquiry.created_at.desc())
    )
    return result.scalars().all()


async def get_inquiry_by_id(db: AsyncSession, inquiry_id: int):
    result = await db.execute(
        select(Inquiry)
        .options(selectinload(Inquiry.user))
        .where(Inquiry.inquiry_id == inquiry_id)
    )
    return result.scalar_one_or_none()
