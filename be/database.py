import os
from sqlmodel import SQLModel, Session, create_engine
from dotenv import load_dotenv

# Models are imported here to have them initialized
from models.user import User
from models.task import Task

load_dotenv()

DATABASE_URL = (
    f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}"
    f"@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT')}/{os.getenv('MYSQL_DB')}"
)

engine = create_engine(DATABASE_URL, echo=True)


def create_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
