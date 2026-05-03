from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class UserSignupRequest(BaseModel):
    email: EmailStr
    password: str
    nickname: str
    image_data: str | None = None  # base64 문자열 가정


class UserInfoResponse(BaseModel):
    user_id: int
    email: EmailStr
    nickname: str
    image_data: str | None = None
    created_at: datetime
    is_admin: bool

    model_config = ConfigDict(from_attributes=True)


class SignupResponse(BaseModel):
    success: bool
    user: UserInfoResponse


class CheckNicknameResponse(BaseModel):
    success: bool
    nickname: str
    duplicated: bool


class CheckEmailResponse(BaseModel):
    success: bool
    email: str
    duplicated: bool


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    success: bool
    user: UserInfoResponse


class FindEmailRequest(BaseModel):
    nickname: str


class FindEmailResponse(BaseModel):
    success: bool
    email: str


class MeResponseUser(BaseModel):
    user_id: int
    email: EmailStr
    nickname: str
    image_data: str | None = None
    created_at: datetime
    is_admin: bool

class MeResponse(BaseModel):
    success: bool
    user: MeResponseUser

class MeUpdateRequest(BaseModel):
    email: EmailStr
    nickname: str
    image_data: str | None = None 