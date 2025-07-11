from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from models.user import User


class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str
    is_complete: bool = False
    assignee_id: int | None = Field(default=None, foreign_key="user.id")
    creator_id: int | None = Field(default=None, foreign_key="user.id")

    assignee: User | None = Relationship(
        back_populates="assigned_tasks",
        sa_relationship_kwargs={"foreign_keys": "Task.assignee_id"},
    )
    creator: User | None = Relationship(
        back_populates="created_tasks",
        sa_relationship_kwargs={"foreign_keys": "Task.creator_id"},
    )


class TaskCreateDTO(SQLModel):
    title: str
    description: str
    assignee_id: int | None = None


class TaskUpdateDTO(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee_id: Optional[int] = None
    is_complete: Optional[bool] = None
