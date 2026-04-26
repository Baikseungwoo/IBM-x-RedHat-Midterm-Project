import json
from datetime import date
from typing import Any

from openai import AsyncOpenAI

from app.core.settings import settings


client = AsyncOpenAI(api_key=settings.openai_api_key)


def _normalize_candidates(candidates: list[dict]) -> list[dict]:
    # 모델에 전달할 최소 필드만 정리
    normalized: list[dict] = []
    for c in candidates:
        normalized.append(
            {
                "content_id": c["content_id"],
                "title": c.get("title"),
                "addr1": c.get("addr1"),
                "addr2": c.get("addr2"),
                "start_date": str(c.get("start_date")),
                "end_date": str(c.get("end_date")),
            }
        )
    return normalized


async def recommend_course_by_gpt(
    *,
    region: str,
    target_date: date,
    keyword: str,
    candidates: list[dict],
) -> dict[str, Any]:
    """
    return:
    {
      "course_title": str,
      "description": str,
      "picked_content_ids": list[int]  # length 3
    }
    """
    if len(candidates) < 3:
        raise ValueError("candidates must be at least 3")

    candidate_payload = _normalize_candidates(candidates)

    system_prompt = (
    "You are a travel course planner for local events in Korea. "
    "Return ONLY valid JSON with keys: course_title, description, picked_content_ids. "
    "picked_content_ids must contain exactly 3 unique integers selected only from candidate content_id values. "
    "description must explain WHY these 3 were selected, explicitly referencing the given keyword."
    )

    user_prompt = {
    "region": region,
    "date": str(target_date),
    "keyword": keyword,
    "candidates": candidate_payload,
    "rule": "Pick 3 events that fit the keyword/date and create a coherent short course. "
            "In description, include selection rationale linked to keyword.",
    }

    res = await client.chat.completions.create(
        model=settings.openai_model,
        response_format={"type": "json_object"},
        temperature=0.3,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(user_prompt, ensure_ascii=False)},
        ],
    )

    raw = res.choices[0].message.content or "{}"
    data = json.loads(raw)

    # 기본 검증
    allowed_ids = {c["content_id"] for c in candidates}
    picked = data.get("picked_content_ids", [])
    if not isinstance(picked, list):
        raise ValueError("picked_content_ids must be list")

    # int 변환 + 중복 제거(순서 유지)
    seen = set()
    normalized_ids: list[int] = []
    for x in picked:
        try:
            v = int(x)
        except Exception:
            continue
        if v in seen:
            continue
        seen.add(v)
        normalized_ids.append(v)

    # 후보에 없는 id 제거
    normalized_ids = [x for x in normalized_ids if x in allowed_ids]

    # 3개 미만이면 fallback으로 채움
    if len(normalized_ids) < 3:
        for c in candidates:
            cid = c["content_id"]
            if cid not in normalized_ids:
                normalized_ids.append(cid)
            if len(normalized_ids) == 3:
                break

    return {
        "course_title": (data.get("course_title") or f"{region} {keyword} 추천 코스").strip(),
        "description": (
            data.get("description")
            or f"{target_date} {region}에서 {keyword} 중심으로 즐길 수 있는 추천 코스입니다."
        ).strip(),
        "picked_content_ids": normalized_ids[:3],
    }
