from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User


async def create_user(
    db: AsyncSession,
    email: str,
    password: str,
    nickname: str,
    image_data: bytes | None = None,
) -> User:
    user = User(
        email=email,
        password=password,
        nickname=nickname,
        image_data=image_data,
        refresh_token="",  # 초기값
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).where(User.user_id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_nickname(db: AsyncSession, nickname: str) -> User | None:
    result = await db.execute(select(User).where(User.nickname == nickname))
    return result.scalar_one_or_none()


async def update_refresh_token(
    db: AsyncSession,
    user: User,
    refresh_token: str,
) -> User:
    user.refresh_token = refresh_token
    await db.commit()
    await db.refresh(user)
    return user


async def update_user_me(
    db: AsyncSession,
    user: User,
    email: str,
    nickname: str,
    image_data: bytes | None,
) -> User:
    user.email = email
    user.nickname = nickname
    user.image_data = image_data
    await db.commit()
    await db.refresh(user)
    return user
