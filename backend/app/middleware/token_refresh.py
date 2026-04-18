from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from jwt import ExpiredSignatureError, InvalidTokenError

from app.core.auth import set_auth_cookies
from app.core.jwt_handle import verify_token, create_access_token, create_refresh_token
from app.db.database import AsyncSessionLocal
from app.db.crud.user import get_user_by_id, update_refresh_token


class TokenRefreshMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        access_token = request.cookies.get("access_token")
        refresh_token = request.cookies.get("refresh_token")

        # access token이 유효하면 그대로 진행
        if access_token:
            try:
                verify_token(access_token)
                return await call_next(request)
            except (ExpiredSignatureError, InvalidTokenError):
                pass

        # access가 없거나 만료된 경우 refresh로 재발급 시도
        if refresh_token:
            try:
                user_id = verify_token(refresh_token)
            except (ExpiredSignatureError, InvalidTokenError):
                return await call_next(request)

            async with AsyncSessionLocal() as db:
                user = await get_user_by_id(db, user_id)
                if not user:
                    return await call_next(request)

                # DB에 저장된 refresh_token과 일치할 때만 재발급
                if user.refresh_token != refresh_token:
                    return await call_next(request)

                new_access_token = create_access_token(user_id)
                new_refresh_token = create_refresh_token(user_id)

                await update_refresh_token(db, user, new_refresh_token)

                # 이번 요청에서 바로 인증 통과하도록 request.state에 주입
                request.state.access_token_override = new_access_token
                request.state.refresh_token_override = new_refresh_token

                response = await call_next(request)
                set_auth_cookies(response, new_access_token, new_refresh_token)
                return response

        return await call_next(request)
