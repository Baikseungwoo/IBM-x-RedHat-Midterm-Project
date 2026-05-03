from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_user_id
from app.db.database import get_db
from app.db.crud.notification import get_my_notifications, get_notification_by_id
from app.db.scheme.notification import NotificationListResponse

router = APIRouter(prefix="/api/notifications", tags=["Notification"])


@router.get("/me", response_model=NotificationListResponse)
async def list_my_notifications(
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    notifications = await get_my_notifications(db, user_id)
    return {"success": True, "notifications": notifications}


@router.patch("/{notification_id}/read")
async def read_notification(
    notification_id: int,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    notification = await get_notification_by_id(db, notification_id)

    if not notification or notification.user_id != user_id:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.is_read = True
    await db.commit()
    await db.refresh(notification)

    return {"success": True, "notification": notification}
