import logging
from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import joinedload
from sqlmodel import Session, select
from database import get_session
from models.task import TaskCreateDTO, Task, TaskUpdateDTO
from models.user import User
from utils.exception import UserNotFoundException

logger = logging.getLogger(__name__)

class TaskService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def get_task_by_id(self, task_id: int):
        statement = (
            select(Task)
            .where(Task.id == task_id)
            .options(joinedload(Task.assignee))
        )
        task = self.session.exec(statement).one_or_none()
        return task

    def find_all(self):
        query = select(Task).options(joinedload(Task.assignee))
        return self.session.exec(query).all()

    def find_all_for_user(self, user_id: int):
        query = select(Task).where(Task.assignee_id == user_id)
        return self.session.exec(query).all()

    def create_task(self, task: TaskCreateDTO, creator_id: int):
        db_task = Task.model_validate(task)

        if db_task.assignee_id is not None:
            user = self.session.get(User, db_task.assignee_id)
            if not user:
                raise UserNotFoundException

        db_task.creator_id = creator_id

        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)

        logger.info(f"Task with id: {db_task.id} created")
        return db_task

    def update_task(self, task_id: int, task_update: TaskUpdateDTO):
        task_for_update = self.get_task_by_id(task_id)

        if not task_for_update:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
            )

        update_fields = task_update.model_dump(exclude_defaults=True)
        for key, value in update_fields.items():
            if key == "assignee_id" and value is not None:
                # Unassign task for assignee_id value of -1
                if value == -1:
                    value = None
                else:
                    user = self.session.get(User, value)
                    if not user:
                        raise UserNotFoundException
            setattr(task_for_update, key, value)

        self.session.add(task_for_update)
        self.session.commit()
        self.session.refresh(task_for_update)

        logger.info(f"Task with id: {task_id} updated")

        return task_for_update

    def delete_task(self, task_id: int):
        task_for_deletion = self.get_task_by_id(task_id)

        if not task_for_deletion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
            )
        
        self.session.delete(task_for_deletion)
        self.session.commit()
        logger.info(f"Task with id: {task_id} updated")



TaskServiceDep = Annotated[TaskService, Depends()]
