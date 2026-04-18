from fastapi import Request, Response, HTTPException, Security
from jwt import ExpiredSignatureError, InvalidTokenError
from app.core.settings import settings
from app.core.jwt_handle import verify_token
from typing import Optional
from fastapi.security import APIKeyCookie

access_cookie_scheme = APIKeyCookie(name="access_token", auto_error=False)

#JWT토큰을 쿠키로 설정
#samesite="Lax" : 외부 도메인 요청 시 쿠키 전송 제한됨
def set_auth_cookies(response:Response, access_token:str, refresh_token:str) -> None:
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=int(settings.access_token_expire_seconds),
        secure=False,
        httponly=True,
        samesite="Lax",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=int(settings.refresh_token_expire_seconds),
        secure=False,
        httponly=True,
        samesite="Lax",
    )

#사용자 쿠키에 액세스 토큰여부 확인
# 토큰 검증
async def get_user_id(request:Request, access_token: str | None = Security(access_cookie_scheme)) -> int:
    token = access_token or request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Access_token missing")

    try:
        user_id = verify_token(token)
        if user_id is None:
            raise HTTPException(status_code=401, detail="no uid")
        return user_id
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access_token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid Access_token")
    
#토큰이 없거나 유효하지 않으면 None 반환
async def get_optional(request:Request) -> Optional[int]:
    access_token=request.cookies.get("access_token")
    if not access_token:
        return None
    try:
        return verify_token(access_token)
    except(ExpiredSignatureError,InvalidTokenError ):
        return None