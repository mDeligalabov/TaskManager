from sqlmodel import SQLModel


class TokenDTO(SQLModel):
    access_token: str
    token_type: str
