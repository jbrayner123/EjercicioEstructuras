from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.db import get_session
from app.models import Node, Edge, User
from app.schemas import NodeIn, NodeOut, EdgeIn, EdgeOut
from app.deps import get_current_user

router = APIRouter(prefix="/graph", tags=["graph"])

# ========== NODOS ==========

@router.post("/nodes", response_model=NodeOut, status_code=status.HTTP_201_CREATED)
def create_node(
    node_in: NodeIn,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Crear un nuevo nodo (requiere autenticación)"""
    # Verificar si ya existe un nodo con ese nombre
    statement = select(Node).where(Node.name == node_in.name)
    existing_node = session.exec(statement).first()
    
    if existing_node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un nodo con el nombre '{node_in.name}'"
        )
    
    # Crear nuevo nodo
    new_node = Node(name=node_in.name)
    session.add(new_node)
    session.commit()
    session.refresh(new_node)
    
    return new_node

@router.get("/nodes", response_model=list[NodeOut])
def list_nodes(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Listar todos los nodos (requiere autenticación)"""
    statement = select(Node)
    nodes = session.exec(statement).all()
    return nodes

@router.delete("/nodes/{node_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_node(
    node_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Eliminar un nodo y sus aristas asociadas (requiere autenticación)"""
    # Buscar el nodo
    statement = select(Node).where(Node.id == node_id)
    node = session.exec(statement).first()
    
    if not node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nodo con id {node_id} no encontrado"
        )
    
    # Eliminar aristas asociadas (src o dst)
    statement_edges = select(Edge).where(
        (Edge.src_id == node_id) | (Edge.dst_id == node_id)
    )
    edges = session.exec(statement_edges).all()
    for edge in edges:
        session.delete(edge)
    
    # Eliminar el nodo
    session.delete(node)
    session.commit()
    
    return None

# ========== ARISTAS ==========

@router.post("/edges", response_model=EdgeOut, status_code=status.HTTP_201_CREATED)
def create_edge(
    edge_in: EdgeIn,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Crear una nueva arista (requiere autenticación)"""
    # Verificar que los nodos existen
    statement_src = select(Node).where(Node.id == edge_in.src_id)
    src_node = session.exec(statement_src).first()
    
    statement_dst = select(Node).where(Node.id == edge_in.dst_id)
    dst_node = session.exec(statement_dst).first()
    
    if not src_node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Nodo origen con id {edge_in.src_id} no existe"
        )
    
    if not dst_node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Nodo destino con id {edge_in.dst_id} no existe"
        )
    
    # Verificar que weight > 0
    if edge_in.weight <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El peso debe ser mayor que 0"
        )
    
    # Crear nueva arista
    new_edge = Edge(
        src_id=edge_in.src_id,
        dst_id=edge_in.dst_id,
        weight=edge_in.weight
    )
    session.add(new_edge)
    session.commit()
    session.refresh(new_edge)
    
    return new_edge

@router.get("/edges", response_model=list[EdgeOut])
def list_edges(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Listar todas las aristas (requiere autenticación)"""
    statement = select(Edge)
    edges = session.exec(statement).all()
    return edges

@router.delete("/edges/{edge_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_edge(
    edge_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Eliminar una arista (requiere autenticación)"""
    statement = select(Edge).where(Edge.id == edge_id)
    edge = session.exec(statement).first()
    
    if not edge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Arista con id {edge_id} no encontrada"
        )
    
    session.delete(edge)
    session.commit()
    
    return None