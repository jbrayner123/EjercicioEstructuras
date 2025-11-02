from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from app.db import get_session
from app.models import Node, Edge, User
from app.schemas import BFSResult, BFSTreeNode, ShortestPathOut
from app.deps import get_current_user
from collections import deque
import heapq

router = APIRouter(prefix="/graph", tags=["algorithms"])

@router.get("/bfs", response_model=BFSResult)
def run_bfs(
    start_id: int = Query(..., description="ID del nodo inicial"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Ejecuta BFS desde un nodo inicial
    Retorna el orden de visita y el árbol BFS
    """
    # Verificar que el nodo existe
    statement = select(Node).where(Node.id == start_id)
    start_node = session.exec(statement).first()
    
    if not start_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nodo con id {start_id} no encontrado"
        )
    
    # Obtener todas las aristas para construir el grafo
    statement_edges = select(Edge)
    edges = session.exec(statement_edges).all()
    
    # Construir grafo de adyacencia
    graph = {}
    statement_nodes = select(Node)
    all_nodes = session.exec(statement_nodes).all()
    
    for node in all_nodes:
        graph[node.id] = []
    
    for edge in edges:
        graph[edge.src_id].append(edge.dst_id)
    
    # Ejecutar BFS
    visited = set()
    queue = deque([start_id])
    visited.add(start_id)
    
    order = []
    parent = {start_id: None}
    depth = {start_id: 0}
    
    while queue:
        current = queue.popleft()
        order.append(current)
        
        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                parent[neighbor] = current
                depth[neighbor] = depth[current] + 1
    
    # Construir árbol BFS
    tree = []
    for node_id in order:
        tree.append(BFSTreeNode(
            node_id=node_id,
            parent_id=parent[node_id],
            depth=depth[node_id]
        ))
    
    return BFSResult(order=order, tree=tree)

@router.get("/shortest-path", response_model=ShortestPathOut)
def run_shortest_path(
    src_id: int = Query(..., description="ID del nodo origen"),
    dst_id: int = Query(..., description="ID del nodo destino"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Ejecuta algoritmo de Dijkstra para encontrar el camino más corto
    entre dos nodos
    """
    # Verificar que ambos nodos existen
    statement_src = select(Node).where(Node.id == src_id)
    src_node = session.exec(statement_src).first()
    
    statement_dst = select(Node).where(Node.id == dst_id)
    dst_node = session.exec(statement_dst).first()
    
    if not src_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nodo origen con id {src_id} no encontrado"
        )
    
    if not dst_node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nodo destino con id {dst_id} no encontrado"
        )
    
    # Obtener todas las aristas
    statement_edges = select(Edge)
    edges = session.exec(statement_edges).all()
    
    # Construir grafo con pesos
    graph = {}
    statement_nodes = select(Node)
    all_nodes = session.exec(statement_nodes).all()
    
    for node in all_nodes:
        graph[node.id] = []
    
    for edge in edges:
        graph[edge.src_id].append((edge.dst_id, edge.weight))
    
    # Ejecutar Dijkstra
    distances = {node.id: float('inf') for node in all_nodes}
    distances[src_id] = 0
    previous = {node.id: None for node in all_nodes}
    
    # Priority queue: (distance, node_id)
    pq = [(0, src_id)]
    visited = set()
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        
        if current in visited:
            continue
        
        visited.add(current)
        
        if current == dst_id:
            break
        
        for neighbor, weight in graph.get(current, []):
            distance = current_dist + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current
                heapq.heappush(pq, (distance, neighbor))
    
    # Verificar si existe camino
    if distances[dst_id] == float('inf'):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No existe camino entre el nodo {src_id} y {dst_id}"
        )
    
    # Reconstruir camino
    path = []
    current = dst_id
    while current is not None:
        path.append(current)
        current = previous[current]
    
    path.reverse()
    
    return ShortestPathOut(path=path, distance=distances[dst_id])