import pytest
from models.task import TaskCreateDTO, TaskUpdateDTO
from models.user import User
from sqlmodel import Session
from service.task_service import TaskService
from utils.exception import UserNotFoundException


def test_create_task_without_assignee(task_service: TaskService):
    task_data = TaskCreateDTO(title="Test Task", description="Test Desc")
    created = task_service.create_task(task_data, creator_id=1)
    assert created.title == "Test Task"
    assert created.creator_id == 1


def test_create_task_with_nonexistent_assignee_raises(task_service: TaskService):
    task_data = TaskCreateDTO(
        title="Failing Task", description="No user", assignee_id=999
    )
    with pytest.raises(UserNotFoundException):
        task_service.create_task(task_data, creator_id=1)


def test_create_task_with_valid_assignee(task_service: TaskService, session: Session):
    user = User(
        id=1,
        email="test@example.com",
        password="hashed_password",
        name="test_user",
        is_admin=False,
    )
    session.add(user)
    session.commit()

    task_data = TaskCreateDTO(title="Assigned Task", description="OK", assignee_id=1)
    task = task_service.create_task(task_data, creator_id=2)
    assert task.assignee_id == 1
    assert task.creator_id == 2


def test_update_task(task_service: TaskService, session: Session):
    task = task_service.create_task(
        TaskCreateDTO(title="Old", description="Desc"), creator_id=1
    )
    updated = task_service.update_task(task.id, TaskUpdateDTO(title="New Title"))

    assert updated.title == "New Title"


def test_update_task_invalid_id(task_service: TaskService):
    with pytest.raises(Exception) as exc:
        task_service.update_task(999, TaskUpdateDTO(title="Test"))
    assert exc.value.status_code == 404


def test_delete_task(task_service: TaskService):
    created = task_service.create_task(
        TaskCreateDTO(title="ToDelete", description="Test"), creator_id=1
    )
    task_service.delete_task(created.id)

    assert task_service.get_task_by_id(created.id) is None


def test_find_all_returns_all(task_service: TaskService):
    task_service.create_task(TaskCreateDTO(title="T1", description="D"), creator_id=1)
    task_service.create_task(TaskCreateDTO(title="T2", description="D"), creator_id=1)
    all_tasks = task_service.find_all()
    assert len(all_tasks) >= 2
