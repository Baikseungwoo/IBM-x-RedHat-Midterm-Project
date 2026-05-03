from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.scheme.user import (
    UserSignupRequest, SignupResponse,
    CheckNicknameResponse, CheckEmailResponse,
    LoginRequest, LoginResponse,
    FindEmailRequest, FindEmailResponse,
)
from app.service.user import (
    signup_service,
    check_nickname_service,
    check_email_service,
    login_service,
    find_email_service,
)

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/signup", response_model=SignupResponse)
async def signup(payload: UserSignupRequest, response: Response, db: AsyncSession = Depends(get_db)):
    return await signup_service(db, payload, response)


@router.get("/check-nickname", response_model=CheckNicknameResponse)
async def check_nickname(nickname: str = Query(...), db: AsyncSession = Depends(get_db)):
    return await check_nickname_service(db, nickname)


@router.get("/check-email", response_model=CheckEmailResponse)
async def check_email(email: str = Query(...), db: AsyncSession = Depends(get_db)):
    return await check_email_service(db, email)


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    return await login_service(db, payload, response)


@router.post("/find-email", response_model=FindEmailResponse)
async def find_email(payload: FindEmailRequest, db: AsyncSession = Depends(get_db)):
    return await find_email_service(db, payload)

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"success": True}

