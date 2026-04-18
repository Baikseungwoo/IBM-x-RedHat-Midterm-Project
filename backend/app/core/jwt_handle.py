from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta, timezone
from app.core.settings import settings
import uuid

pwd_crypt=CryptContext(schemes=["bcrypt"])

def get_password_hash(password:str):
    trunc_password=password.encode('utf-8')[:72]
    return pwd_crypt.hash(trunc_password)

def verify_password(plain_pw:str, hashed_pw:str)->bool:
    trunc_password=plain_pw.encode('utf-8')[:72]
    return pwd_crypt.verify(trunc_password, hashed_pw)


def create_token(uid:int, expires_delta:timedelta,**kwargs) -> str:
    to_encode=kwargs.copy() 
    expire=datetime.now(timezone.utc) + timedelta(seconds=expires_delta)
    to_encode.update({"exp":expire, "uid":uid})
    encoded_jwt=jwt.encode(to_encode, settings.secret_key, settings.jwt_algorithm)
    return encoded_jwt

def create_access_token(uid:int)->str:
    return create_token(uid=uid, expires_delta=settings.access_token_expire_seconds)


#리프레시 토큰 관리
def create_refresh_token(uid:int) -> str:
    return create_token(uid=uid, jti=str(uuid.uuid4()), expires_delta=settings.refresh_token_expire_seconds)


def decode_token(token:str)->dict:
    return jwt.decode(
        token,
        settings.secret_key,
        algorithms=[settings.jwt_algorithm]
    )

#토큰 -> 사용자 id
def verify_token(token:str)->int:
    payload=decode_token(token)
    return payload.get("uid")