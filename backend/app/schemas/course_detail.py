from pydantic import BaseModel


# 생성
class CourseDetailCreate(BaseModel):
    course_id: int
    course_detail_content: str | None = None


# 응답
class CourseDetailResponse(BaseModel):
    course_detail_id: int
    course_id: int
    course_detail_content: str | None

    class Config:
        from_attributes = True