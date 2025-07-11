import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from models.user import UserOutDTO
from service.user_service import UserServiceDep

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
TOKEN_EXPIRE_MINUTES = int(os.getenv("TOKEN_EXPIRE_MINUTES"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


def get_current_user(
    user_service: UserServiceDep, token: str = Depends(oauth2_scheme)
) -> UserOutDTO:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    deactivated_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="User has been deactivated"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = user_service.get_user_by_email(email)
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise deactivated_exception

    return UserOutDTO.model_validate(user)


def admin_required(current_user: UserOutDTO = Depends(get_current_user)) -> UserOutDTO:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required"
        )
    return current_user
