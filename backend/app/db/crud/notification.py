from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.notification import Notification


async def create_notification(db: AsyncSession, user_id: int, title: str, message: str):
    notification = Notification(user_id=user_id, title=title, message=message)
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification


async def get_my_notifications(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
    )
    return result.scalars().all()


async def get_notification_by_id(db: AsyncSession, notification_id: int):
    result = await db.execute(
        select(Notification).where(Notification.notification_id == notification_id)
    )
    return result.scalar_one_or_none()
