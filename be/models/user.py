from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True)
    password: str
    name: str
    is_admin: bool = Field(default=False)
    is_active: bool = Field(default=True)

    assigned_tasks: List["Task"] = Relationship(
        back_populates="assignee",
        sa_relationship_kwargs={"foreign_keys": "Task.assignee_id"},
    )
    created_tasks: List["Task"] = Relationship(
        back_populates="creator",
        sa_relationship_kwargs={"foreign_keys": "Task.creator_id"},
    )


class UserCreateDTO(SQLModel):
    email: str
    password: str
    name: str


class UpdateUserDTO(SQLModel):
    name: str


class UserOutDTO(SQLModel):
    id: int
    email: str
    name: str
    is_admin: bool
    is_active: bool
