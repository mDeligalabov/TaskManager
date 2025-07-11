from fastapi import APIRouter, Depends, status
from starlette.responses import JSONResponse
from models.user import UserCreateDTO, UserOutDTO
from models.token import TokenDTO
from service.user_service import UserServiceDep
from service.auth_service import AuthServiceDep
from fastapi.security import OAuth2PasswordRequestForm
from utils.dependencies import get_current_user, admin_required

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/all/active", response_model=list[UserOutDTO])
async def get_all_active_users(
    user_service: UserServiceDep, current_user: UserOutDTO = Depends(get_current_user)
) -> list[UserOutDTO]:
    users = user_service.get_all_active_users()
    return [UserOutDTO.model_validate(user) for user in users]


@router.get("/all", response_model=list[UserOutDTO])
async def get_all_users(
    user_service: UserServiceDep, current_admin: UserOutDTO = Depends(admin_required)
) -> list[UserOutDTO]:
    users = user_service.get_all_users()
    return [UserOutDTO.model_validate(user) for user in users]


@router.post("/register", response_model=UserOutDTO)
async def create_user(user: UserCreateDTO, user_service: UserServiceDep) -> UserOutDTO:
    new_user = user_service.register_user(user)
    return UserOutDTO.model_validate(new_user)


@router.post("/register/admin", response_model=UserOutDTO)
async def create_user(user: UserCreateDTO, user_service: UserServiceDep) -> UserOutDTO:
    new_user = user_service.register_user(user, is_admin=True)
    return UserOutDTO.model_validate(new_user)


@router.get("/me", response_model=UserOutDTO)
async def read_users_me(
    current_user: UserOutDTO = Depends(get_current_user),
) -> UserOutDTO:
    return UserOutDTO.model_validate(current_user)


@router.post("/login", response_model=TokenDTO)
async def login_for_access_token(
    auth_service: AuthServiceDep, form_data: OAuth2PasswordRequestForm = Depends()
):
    return auth_service.authenticate_user(form_data.username, form_data.password)


@router.post("/deactivate/{userId}")
async def deactivate_user(
    user_service: UserServiceDep,
    user_id: int,
    current_admin: UserOutDTO = Depends(admin_required),
) -> JSONResponse:
    user_service.deactivate_user(user_id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": f"User with id: {user_id} -> deactivated"},
    )


@router.post("/activate/{userId}")
async def activate_user(
    user_service: UserServiceDep,
    user_id: int,
    current_admin: UserOutDTO = Depends(admin_required),
) -> JSONResponse:
    user_service.activate_user(user_id)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": f"User with id: {user_id} -> activated"},
    )
