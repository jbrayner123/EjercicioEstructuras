from sqlmodel import SQLModel, create_engine, Session
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Leer URL de MySQL desde variable de entorno
MYSQL_URL = os.getenv(
    "MYSQL_URL", 
    "mysql+pymysql://root:@localhost:3306/pathfinder_db?charset=utf8mb4"
)

# Crear el engine de MySQL
engine = create_engine(
    MYSQL_URL, 
    echo=False,  # Cambiar a True para ver queries SQL en consola
    pool_pre_ping=True,  # Verifica conexiones antes de usarlas
    pool_recycle=3600,   # Recicla conexiones cada hora para evitar timeouts
)

def init_db():
    """
    Crea todas las tablas en la base de datos basándose en los modelos SQLModel
    """
    from app.models import User, Node, Edge  # Importar aquí para evitar import circular
    SQLModel.metadata.create_all(engine)
    print("✅ Base de datos MySQL inicializada - Tablas creadas")

def get_session():
    """
    Generator que proporciona una sesión de base de datos
    Se usa como dependencia en FastAPI
    """
    with Session(engine) as session:
        yield session