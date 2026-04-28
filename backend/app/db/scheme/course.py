from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class CourseEventRef(BaseModel):
    content_id: int
    sequence: int = Field(..., ge=1)


class CourseRecommendRequest(BaseModel):
    region: str
    date: date
    keyword: str


class CourseRecommendEventItem(BaseModel):
    content_id: int
    title: str
    first_image: str | None = None
    addr1: str | None = None
    addr2: str | None = None
    start_date: date
    end_date: date
    mapx: float | None = None
    mapy: float | None = None


class CourseRecommendResponse(BaseModel):
    success: bool
    course_title: str
    region: str
    date: date
    keyword: str
    description: str
    course: list[CourseRecommendEventItem]


class CourseSaveRequest(BaseModel):
    region: str
    course_title: str
    description: str
    date: date
    keyword: str
    course: list[CourseEventRef]


class CourseSaveResponse(BaseModel):
    success: bool
    course_id: int
    user_id: int
    region: str
    course_title: str
    description: str
    date: date
    keyword: str
    created_at: datetime


class MyCourseItem(BaseModel):
    course_id: int
    region: str
    course_title: str
    description: str
    date: date
    keyword: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MyCoursesResponse(BaseModel):
    success: bool
    courses: list[MyCourseItem]


class DeleteCourseResponse(BaseModel):
    success: bool
    course_id: int
