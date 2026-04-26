from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_user_id
from app.db.database import get_db
from app.db.scheme.course import (
    CourseRecommendRequest,
    CourseRecommendResponse,
    CourseSaveRequest,
    CourseSaveResponse,
)
from app.service.course import recommend_course_service, save_course_service

router = APIRouter(prefix="/api/courses", tags=["AI"])


@router.post("/recommend", response_model=CourseRecommendResponse)
async def recommend_course(
    payload: CourseRecommendRequest,
    db: AsyncSession = Depends(get_db),
):
    return await recommend_course_service(db, payload)


@router.post("", response_model=CourseSaveResponse)
async def save_course(
    payload: CourseSaveRequest,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await save_course_service(db, user_id, payload)
