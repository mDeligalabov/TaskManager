import pytest
from fastapi import HTTPException
from models.user import UserCreateDTO
from service.user_service import UserService
from utils.exception import UserNotFoundException
from utils.security import verify_password


@pytest.fixture
def user_data():
    return UserCreateDTO(
        email="user@example.com", password="password123", name="Test User"
    )   


def test_register_user_success(user_service: UserService, user_data: UserCreateDTO):
    user = user_service.register_user(user_data)
    assert user.id is not None
    assert user.email == user_data.email
    assert verify_password(user_data.password, user.password)


def test_register_user_conflict(user_service: UserService, user_data: UserCreateDTO):
    user_service.register_user(user_data)
    with pytest.raises(HTTPException) as e:
        user_service.register_user(user_data)
    assert e.value.status_code == 409


def test_get_user_by_email_found(user_service: UserService, user_data: UserCreateDTO):
    created = user_service.register_user(user_data)
    found = user_service.get_user_by_email(user_data.email)
    assert found.id == created.id


def test_get_user_by_email_not_found(user_service: UserService):
    with pytest.raises(UserNotFoundException):
        user_service.get_user_by_email("missing@example.com")


def test_get_user_by_id_found(user_service: UserService, user_data: UserCreateDTO):
    created = user_service.register_user(user_data)
    found = user_service.get_user_by_id(created.id)
    assert found.email == user_data.email


def test_get_user_by_id_not_found(user_service: UserService):
    with pytest.raises(UserNotFoundException):
        user_service.get_user_by_id(999)


def test_deactivate_user(user_service: UserService, user_data: UserCreateDTO):
    user = user_service.register_user(user_data)
    user_service.deactivate_user(user.id)
    updated = user_service.get_user_by_id(user.id)
    assert updated.is_active is False


def test_activate_user(user_service: UserService, user_data: UserCreateDTO):
    user = user_service.register_user(user_data)
    user_service.deactivate_user(user.id)
    user_service.activate_user(user.id)
    updated = user_service.get_user_by_id(user.id)
    assert updated.is_active is True


def test_get_all_users_only_active(user_service: UserService, user_data: UserCreateDTO):
    user1 = user_service.register_user(user_data)
    user2 = user_service.register_user(
        UserCreateDTO(email="second@example.com", password="123", name="Second")
    )
    user_service.deactivate_user(user2.id)
    active_users = user_service.get_all_users()
    assert len(active_users) == 1
    assert active_users[0].email == user1.email


def test_get_all_users_include_inactive(
    user_service: UserService, user_data: UserCreateDTO
):
    user1 = user_service.register_user(user_data)
    user2 = user_service.register_user(
        UserCreateDTO(email="second@example.com", password="123", name="Second")
    )
    user_service.deactivate_user(user2.id)
    all_users = user_service.get_all_users(only_active=False)
    assert len(all_users) == 2
