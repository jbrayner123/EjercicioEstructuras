from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, max_length=50)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Node(SQLModel, table=True):
    __tablename__ = "nodes"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True, max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Edge(SQLModel, table=True):
    __tablename__ = "edges"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    src_id: int = Field(foreign_key="nodes.id", index=True)
    dst_id: int = Field(foreign_key="nodes.id", index=True)
    weight: float
    created_at: datetime = Field(default_factory=datetime.utcnow)