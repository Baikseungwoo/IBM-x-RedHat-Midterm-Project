from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.crud.course import (
    create_course_with_items,
    delete_my_course,
    list_my_courses,
    list_recommendation_candidates,
)
from app.db.scheme.course import CourseRecommendRequest, CourseSaveRequest
from app.external.openai.client import recommend_course_by_gpt


def _fallback_recommendation(
    region: str,
    target_date,
    keyword: str,
    candidates: list[dict],
) -> tuple[str, str, list[dict]]:
    picked = candidates[:3]
    course_title = f"{region} {keyword} 추천 코스"
    description = (
    f"{target_date} {region}에서 '{keyword}' 테마에 맞는 코스를 구성했습니다. "
    f"키워드와의 관련성, 일정 적합성(해당 날짜 운영), 그리고 인기도(좋아요/북마크)를 함께 고려해 "
    "3개 행사를 선택했습니다."
    )
    return course_title, description, picked


async def recommend_course_service(db: AsyncSession, payload: CourseRecommendRequest) -> dict:
    region = payload.region.strip()
    keyword = payload.keyword.strip()

    candidates = await list_recommendation_candidates(
        db=db,
        region=region,
        target_date=payload.date,
        limit=50,
    )

    if len(candidates) < 3:
        raise HTTPException(
            status_code=404,
            detail="Not enough events to recommend (need at least 3).",
        )

    try:
        gpt_result = await recommend_course_by_gpt(
            region=region,
            target_date=payload.date,
            keyword=keyword,
            candidates=candidates,
        )

        picked_ids = gpt_result["picked_content_ids"]
        by_id = {c["content_id"]: c for c in candidates}
        picked = [by_id[cid] for cid in picked_ids if cid in by_id][:3]

        if len(picked) < 3:
            raise ValueError("GPT picked less than 3 valid events")

        course_title = gpt_result["course_title"]
        description = gpt_result["description"]

    except Exception:
        course_title, description, picked = _fallback_recommendation(
            region=region,
            target_date=payload.date,
            keyword=keyword,
            candidates=candidates,
        )

    return {
        "success": True,
        "course_title": course_title,
        "region": region,
        "date": payload.date,
        "keyword": keyword,
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
