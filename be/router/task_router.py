from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from models.user import UserOutDTO
from models.task import TaskCreateDTO, Task, TaskUpdateDTO, TaskWithAssigneeDTO
from service.task_service import TaskServiceDep
from utils.dependencies import get_current_user
from utils.exception import UserNotFoundException

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=List[TaskWithAssigneeDTO])
async def get_all_tasks(
    task_service: TaskServiceDep, current_user: UserOutDTO = Depends(get_current_user)
):
    tasks = task_service.find_all()
    return tasks


@router.get("/my", response_model=List[TaskWithAssigneeDTO])
async def get_my_tasks(
    task_service: TaskServiceDep, current_user: UserOutDTO = Depends(get_current_user)
) -> List[Task]:
    return task_service.find_all_for_user(user_id=current_user.id)


@router.get("/{task_id}", response_model=TaskWithAssigneeDTO)
async def get_task(
    task_service: TaskServiceDep,
    task_id: int,
    current_user: UserOutDTO = Depends(get_current_user),
) -> Task:
    task = task_service.get_task_by_id(task_id=task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task

@router.post("", response_model=Task)
async def create_task(
    task_service: TaskServiceDep,
    task: TaskCreateDTO,
    current_user: UserOutDTO = Depends(get_current_user),
):
    try:
        task = task_service.create_task(task=task, creator_id=current_user.id)
        return task
    except UserNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignee not found"
        )


@router.patch("/{task_id}", response_model=Task)
async def update_task(
    task_service: TaskServiceDep,
    task_id: int,
    task_update: TaskUpdateDTO,
    current_user: UserOutDTO = Depends(get_current_user),
) -> Task:
    try:
        updated_task = task_service.update_task(task_id=task_id, task_update=task_update)
        return updated_task
    except UserNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assignee not found"
        )


@router.delete("/{task_id}")
async def delete_task(task_service: TaskServiceDep, task_id):
    task_service.delete_task(task_id=task_id)
    return JSONResponse(status_code=200, content={"message": "Successfully deleted"})
