from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_user_id
from app.db.database import get_db
from app.db.scheme.user import MeResponse, MeUpdateRequest
from app.service.user import get_me_service, update_me_service
from app.service.bookmark import list_my_bookmarks_service, delete_my_bookmark_service

router = APIRouter(prefix="/api/users", tags=["MyPage"])


@router.get("/me", response_model=MeResponse)
async def get_me(
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await get_me_service(db, user_id)


@router.put("/me", response_model=MeResponse)
async def update_me(
    payload: MeUpdateRequest,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await update_me_service(db, user_id, payload)



@router.get("/me/bookmarks")
async def get_my_bookmarks(
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await list_my_bookmarks_service(db, user_id)


@router.delete("/me/bookmarks/{content_id}")
async def delete_my_bookmark(
    content_id: int,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await delete_my_bookmark_service(db, user_id, content_id)