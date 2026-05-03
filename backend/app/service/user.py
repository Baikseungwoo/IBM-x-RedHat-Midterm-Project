import base64

from fastapi import HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import set_auth_cookies
from app.core.jwt_handle import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from app.db.crud.user import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    get_user_by_nickname,
    update_refresh_token,
    update_user_me,
)
from app.db.scheme.user import (
    UserSignupRequest,
    LoginRequest,
    FindEmailRequest,
    MeUpdateRequest,
)
from pathlib import Path

DEFAULT_IMAGE_PATH = Path("app/assets/default_profile.png")
DEFAULT_IMAGE_BYTES = DEFAULT_IMAGE_PATH.read_bytes()



def _decode_image_data(image_data: str | None) -> bytes | None:
    if not image_data:
        return None
    try:
        return base64.b64decode(image_data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image_data(base64)")


def _encode_image_data(image_data: bytes | None) -> str | None:
    if not image_data:
        return None
    return base64.b64encode(image_data).decode("utf-8")


def _user_payload(user) -> dict:
    return {
        "user_id": user.user_id,
        "email": user.email,
        "nickname": user.nickname,
        "image_data": _encode_image_data(user.image_data),
        "created_at": user.created_at,
        "is_admin": user.is_admin,
    }


async def signup_service(
    db: AsyncSession,
    payload: UserSignupRequest,
    response: Response,
) -> dict:
    exists_email = await get_user_by_email(db, payload.email)
    if exists_email:
        raise HTTPException(status_code=409, detail="Email already exists")

    exists_nickname = await get_user_by_nickname(db, payload.nickname)
    if exists_nickname:
        raise HTTPException(status_code=409, detail="Nickname already exists")

    hashed_pw = get_password_hash(payload.password)

    if payload.image_data is None:
        image_bytes = DEFAULT_IMAGE_BYTES
    else:
        image_bytes = _decode_image_data(payload.image_data)


    user = await create_user(
        db=db,
        email=payload.email,
        password=hashed_pw,
        nickname=payload.nickname,
        image_data=image_bytes,
    )

    access_token = create_access_token(uid=user.user_id)
    refresh_token = create_refresh_token(uid=user.user_id)
    await update_refresh_token(db, user, refresh_token)
    set_auth_cookies(response, access_token, refresh_token)

    return {"success": True, "user": _user_payload(user)}


async def check_nickname_service(db: AsyncSession, nickname: str) -> dict:
    user = await get_user_by_nickname(db, nickname)
    return {"success": True, "nickname": nickname, "duplicated": user is not None}


async def check_email_service(db: AsyncSession, email: str) -> dict:
    user = await get_user_by_email(db, email)
    return {"success": True, "email": email, "duplicated": user is not None}


async def login_service(
    db: AsyncSession,
    payload: LoginRequest,
    response: Response,
) -> dict:
    user = await get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(uid=user.user_id)
    refresh_token = create_refresh_token(uid=user.user_id)
    await update_refresh_token(db, user, refresh_token)
    set_auth_cookies(response, access_token, refresh_token)

    return {"success": True, "user": _user_payload(user)}


async def find_email_service(db: AsyncSession, payload: FindEmailRequest) -> dict:
    user = await get_user_by_nickname(db, payload.nickname)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "email": user.email}


async def get_me_service(db: AsyncSession, user_id: int) -> dict:
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "user": _user_payload(user)}


async def update_me_service(
    db: AsyncSession,
    user_id: int,
    payload: MeUpdateRequest,
) -> dict:
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    email_owner = await get_user_by_email(db, payload.email)
    if email_owner and email_owner.user_id != user.user_id:
        raise HTTPException(status_code=409, detail="Email already exists")

    nickname_owner = await get_user_by_nickname(db, payload.nickname)
    if nickname_owner and nickname_owner.user_id != user.user_id:
        raise HTTPException(status_code=409, detail="Nickname already exists")

    if payload.image_data is None:
        image_bytes = user.image_data
    elif payload.image_data == "":
        image_bytes = DEFAULT_IMAGE_BYTES
    else:
        image_bytes = _decode_image_data(payload.image_data)


    updated = await update_user_me(
        db=db,
        user=user,
        email=payload.email,
        nickname=payload.nickname,
        image_data=image_bytes,
    )
    return {"success": True, "user": _user_payload(updated)}
