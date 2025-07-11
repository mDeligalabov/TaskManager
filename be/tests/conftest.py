import pytest
from sqlmodel import Session, SQLModel, create_engine
from models.task import Task
from models.user import User
from service.task_service import TaskService
from service.user_service import UserService

# In-memory SQLite engine
test_engine = create_engine("sqlite://", echo=False)


# Set up test DB schema
@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    SQLModel.metadata.create_all(test_engine)


@pytest.fixture
def session():
    # New in-memory DB per test
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture
def task_service(session: Session):
    return TaskService(session=session)


@pytest.fixture
def user_service(session: Session):
    return UserService(session=session)
