from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.db import init_db
from app.auth import router as auth_router
from app.routers import graph, algorithms
import os

# Cargar variables de entorno
load_dotenv()

# Crear la aplicación FastAPI
app = FastAPI(title="PathFinder Minimal API", version="1.0.0")

# Configurar CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Incluir routers
app.include_router(auth_router)
app.include_router(graph.router)
app.include_router(algorithms.router)

# Evento al iniciar la aplicación
@app.on_event("startup")
def on_startup():
    print("🚀 Iniciando aplicación PathFinder API...")
    init_db()
    print("✅ Aplicación lista!")

# Endpoint raíz
@app.get("/")
def root():
    return {
        "message": "PathFinder API",
        "version": "1.0.0",
        "docs": "/docs"
    }