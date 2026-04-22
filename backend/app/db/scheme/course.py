from pydantic import BaseModel


# 생성
class CourseCreate(BaseModel):
    course_title: str
    course_content: str | None = None
    course_location: str | None = None


# 응답
class CourseResponse(BaseModel):
    course_id: int
    course_title: str
    course_content: str | None
    course_location: str | None

    class Config:
        from_attributes = True