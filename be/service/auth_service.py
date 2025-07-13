from fastapi import HTTPException, status, Depends
from typing import Annotated
from sqlmodel import Session, select

from models.token import TokenDTO
from utils.security import verify_password, create_access_token
from database import get_session
from models.user import User


class AuthService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def authenticate_user(self, email: str, password: str, admin_login = False) -> TokenDTO:
        query = select(User).where(User.email == email)
        user = self.session.exec(query).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is deactivated.",
            )

        if admin_login and not user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is not an administrator",
            )


        access_token = create_access_token(data={"sub": user.email, "id": user.id})
        return TokenDTO.model_validate(
            {"access_token": access_token, "token_type": "bearer"}
        )


AuthServiceDep = Annotated[AuthService, Depends()]
