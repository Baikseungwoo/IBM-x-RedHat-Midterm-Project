from pydantic import BaseModel, ConfigDict, Field


class CourseItemCreate(BaseModel):
    content_id: int
    sequence: int = Field(..., ge=1)


class CourseItemResponse(BaseModel):
    course_item_id: int
    course_id: int
    content_id: int
    sequence: int

    model_config = ConfigDict(from_attributes=True)
