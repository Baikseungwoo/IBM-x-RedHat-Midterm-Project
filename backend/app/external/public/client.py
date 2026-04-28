import httpx
from app.core.settings import settings

DEFAULT_PARAMS = {
    "MobileOS": "ETC",
    "MobileApp": "midterm",
    "_type": "json",
}

def _validate_api_result(data: dict) -> None:
    header = data.get("response", {}).get("header", {})
    code = str(header.get("resultCode", ""))
    msg = header.get("resultMsg", "")
    if code not in {"0000", "0"}:
        raise RuntimeError(f"Public API error: resultCode={code}, resultMsg={msg}")


def _to_items(data: dict) -> list[dict]:
    body = data.get("response", {}).get("body", {})
    items = body.get("items", {}).get("item", [])
    if isinstance(items, dict):
        return [items]
    return items or []


async def fetch_festival_page(
    page_no: int = 1,
    num_of_rows: int = 100,
    event_start_date: str | None = None,  # YYYYMMDD
    event_end_date: str | None = None,    # YYYYMMDD
) -> tuple[list[dict], int]:
    url = f"{settings.public_api_base_url}/searchFestival2"
    params = {
        **DEFAULT_PARAMS,
        "serviceKey": settings.public_api_key,
        "pageNo": page_no,
        "numOfRows": num_of_rows,
    }
    if event_start_date:
        params["eventStartDate"] = event_start_date
    if event_end_date:
        params["eventEndDate"] = event_end_date

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(url, params=params)
        res.raise_for_status()
        data = res.json()
        _validate_api_result(data)


    body = data.get("response", {}).get("body", {})
    total_count = int(body.get("totalCount", 0))
    return _to_items(data), total_count


async def fetch_detail_intro(content_id: int, content_type_id: int) -> dict | None:
    url = f"{settings.public_api_base_url}/detailIntro2"
    params = {
        **DEFAULT_PARAMS,
        "serviceKey": settings.public_api_key,
        "contentId": content_id,
        "contentTypeId": content_type_id,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(url, params=params)
        res.raise_for_status()
        data = res.json()
        _validate_api_result(data)


    items = _to_items(data)
    return items[0] if items else None

