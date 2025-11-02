from pydantic import BaseModel, Field
from typing import Optional

class UserIn(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class NodeIn(BaseModel):
    name: str

class NodeOut(BaseModel):
    id: int
    name: str

class EdgeIn(BaseModel):
    src_id: int
    dst_id: int
    weight: float = Field(gt=0)

class EdgeOut(BaseModel):
    id: int
    src_id: int
    dst_id: int
    weight: float

class BFSTreeNode(BaseModel):
    node_id: int
    parent_id: Optional[int]
    depth: int

class BFSResult(BaseModel):
    order: list[int]
    tree: list[BFSTreeNode]

class ShortestPathOut(BaseModel):
    path: list[int]
    distance: float
