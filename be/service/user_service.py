import logging
from sqlmodel import Session, select
from fastapi import Depends, HTTPException, status
from typing import Annotated, List
from database import get_session
from models.user import User, UserCreateDTO
from utils.security import get_password_hash
from utils.exception import UserNotFoundException

logger = logging.getLogger(__name__)


class UserService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def get_all_users(self, only_active: bool = True) -> List[User]:
        query = select(User)
        if only_active:
            query = query.where(User.is_active == True)
        users = self.session.exec(query).all()
        return users

    def register_user(self, user_data: UserCreateDTO, is_admin: bool = False) -> User:
        try:
            self.get_user_by_email(user_data.email)
            # Exception will be raised only if there is a user with the same email
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
            )
        except UserNotFoundException:
            pass

        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            password=hashed_password,
            name=user_data.name,
            is_admin=is_admin,
        )

        self.session.add(new_user)
        self.session.commit()
        self.session.refresh(new_user)
        logger.info(f"User created with email: {user_data.email}")
        return new_user

    def get_user_by_email(self, email: str) -> User:
        statement = select(User).where(User.email == email)
        user = self.session.exec(statement).first()
        if user is None:
            raise UserNotFoundException
        return user

    def get_user_by_id(self, id: int) -> User:
        statement = select(User).where(User.id == id)
        user = self.session.exec(statement).first()
        if user is None:
            raise UserNotFoundException
        return user

    def deactivate_user(self, user_id):
        try:
            user = self.get_user_by_id(user_id)
            if user.is_active:
                user.is_active = False
                self.session.add(user)
                self.session.commit()
        except UserNotFoundException:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

    def activate_user(self, user_id):
        try:
            user = self.get_user_by_id(user_id)
            if not user.is_active:
                user.is_active = True
                self.session.add(user)
                self.session.commit()
        except UserNotFoundException:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )


UserServiceDep = Annotated[UserService, Depends()]
