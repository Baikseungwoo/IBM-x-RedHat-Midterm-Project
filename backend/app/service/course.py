from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.crud.course import (
    create_course_with_items,
    delete_my_course,
    list_my_courses,
    list_recommendation_candidates,
)
from app.db.scheme.course import CourseRecommendRequest, CourseSaveRequest


def _build_default_recommendation(
    region: str,
    target_date,
    keyword: str,
    candidates: list[dict],
) -> tuple[str, str, list[dict]]:
    # TODO: 여기를 GPT 내부 API 호출 로직으로 교체하면 됨.
    picked = candidates[:3]
    course_title = f"{region} {keyword} 추천 코스"
    description = (
        f"{target_date}에 {region}에서 즐길 수 있는 '{keyword}' 중심 일정입니다. "
        f"인기/북마크 지표를 기준으로 동선 구성이 쉬운 3개 행사를 추천합니다."
    )
    return course_title, description, picked


async def recommend_course_service(db: AsyncSession, payload: CourseRecommendRequest) -> dict:
    candidates = await list_recommendation_candidates(
        db=db,
        region=payload.region.strip(),
        target_date=payload.date,
        keyword=payload.keyword.strip(),
        limit=50,
    )

    if len(candidates) < 3:
        raise HTTPException(
            status_code=404,
            detail="Not enough events to recommend (need at least 3).",
        )

    course_title, description, picked = _build_default_recommendation(
        region=payload.region.strip(),
        target_date=payload.date,
        keyword=payload.keyword.strip(),
        candidates=candidates,
    )

    return {
        "success": True,
        "course_title": course_title,
        "region": payload.region.strip(),
        "date": payload.date,
        "keyword": payload.keyword.strip(),
        "description": description,
        "course": picked,
    }


async def save_course_service(db: AsyncSession, user_id: int, payload: CourseSaveRequest) -> dict:
    if not payload.course:
        raise HTTPException(status_code=400, detail="course must not be empty")

    sequences = [item.sequence for item in payload.course]
    if len(set(sequences)) != len(sequences):
        raise HTTPException(status_code=400, detail="duplicate sequence in course")

    content_ids = [item.content_id for item in payload.course]
    if len(set(content_ids)) != len(content_ids):
        raise HTTPException(status_code=400, detail="duplicate content_id in course")

    items = [{"content_id": item.content_id, "sequence": item.sequence} for item in payload.course]
    items.sort(key=lambda x: x["sequence"])

    created = await create_course_with_items(
        db=db,
        user_id=user_id,
        region=payload.region.strip(),
        course_title=payload.course_title.strip(),
        description=payload.description.strip(),
        target_date=payload.date,
        keyword=payload.keyword.strip(),
        items=items,
    )

    if created is None:
        raise HTTPException(status_code=400, detail="invalid course items or event ids")

    return {
        "success": True,
        "course_id": created.course_id,
        "user_id": created.user_id,
        "region": created.region,
        "course_title": created.course_title,
        "description": created.description,
        "date": created.date,
        "keyword": created.keyword,
        "created_at": created.created_at,
    }


async def list_my_courses_service(db: AsyncSession, user_id: int) -> dict:
    courses = await list_my_courses(db, user_id)
    return {"success": True, "courses": courses}


async def delete_my_course_service(db: AsyncSession, user_id: int, course_id: int) -> dict:
    deleted = await delete_my_course(db, user_id, course_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Course not found or no permission")
    return {"success": True, "course_id": course_id}
