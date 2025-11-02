import sys
import os
from pathlib import Path

# Agregar la carpeta padre al path para poder importar app
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlmodel import Session, select
from app.db import engine, init_db
from app.models import Node, Edge
import csv

def load_seed_data():
    """
    Carga los datos desde los archivos CSV a la base de datos
    Es idempotente: si los datos ya existen, no los duplica
    """
    print("🌱 Iniciando carga de datos semilla...")
    
    # Inicializar base de datos (crear tablas si no existen)
    init_db()
    
    # Rutas a los archivos CSV
    data_dir = Path(__file__).parent.parent / "data"
    nodes_file = data_dir / "nodes.csv"
    edges_file = data_dir / "edges.csv"
    
    if not nodes_file.exists():
        print(f"❌ Error: No se encontró el archivo {nodes_file}")
        return
    
    if not edges_file.exists():
        print(f"❌ Error: No se encontró el archivo {edges_file}")
        return
    
    with Session(engine) as session:
        # ========== CARGAR NODOS ==========
        print("\n📍 Cargando nodos...")
        
        # Leer nodos del CSV
        with open(nodes_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            nodes_data = [row for row in reader]
        
        # Mapeo de nombre -> id
        node_map = {}
        nodes_created = 0
        nodes_skipped = 0
        
        for row in nodes_data:
            name = row['name'].strip()
            if not name:
                continue
            
            # Verificar si ya existe
            statement = select(Node).where(Node.name == name)
            existing = session.exec(statement).first()
            
            if existing:
                node_map[name] = existing.id
                nodes_skipped += 1
            else:
                new_node = Node(name=name)
                session.add(new_node)
                session.flush()  # Para obtener el ID
                node_map[name] = new_node.id
                nodes_created += 1
        
        session.commit()
        print(f"   ✅ Nodos creados: {nodes_created}")
        print(f"   ⏭️  Nodos existentes (omitidos): {nodes_skipped}")
        
        # ========== CARGAR ARISTAS ==========
        print("\n🔗 Cargando aristas...")
        
        # Leer aristas del CSV
        with open(edges_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            edges_data = [row for row in reader]
        
        edges_created = 0
        edges_skipped = 0
        
        for row in edges_data:
            src_name = row['src_name'].strip()
            dst_name = row['dst_name'].strip()
            weight = float(row['weight'])
            
            if src_name not in node_map:
                print(f"   ⚠️  Advertencia: Nodo '{src_name}' no encontrado, omitiendo arista")
                continue
            
            if dst_name not in node_map:
                print(f"   ⚠️  Advertencia: Nodo '{dst_name}' no encontrado, omitiendo arista")
                continue
            
            src_id = node_map[src_name]
            dst_id = node_map[dst_name]
            
            # Verificar si ya existe la arista
            statement = select(Edge).where(
                Edge.src_id == src_id,
                Edge.dst_id == dst_id
            )
            existing = session.exec(statement).first()
            
            if existing:
                edges_skipped += 1
            else:
                new_edge = Edge(src_id=src_id, dst_id=dst_id, weight=weight)
                session.add(new_edge)
                edges_created += 1
        
        session.commit()
        print(f"   ✅ Aristas creadas: {edges_created}")
        print(f"   ⏭️  Aristas existentes (omitidas): {edges_skipped}")
    
    print("\n✅ Carga de datos completada exitosamente!")
    print(f"\n📊 Resumen:")
    print(f"   • Total nodos: {len(node_map)}")
    print(f"   • Total aristas: {edges_created + edges_skipped}")

if __name__ == "__main__":
    load_seed_data()