from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from app.db import get_session
from app.models import User
from app.schemas import UserIn, UserOut, TokenOut
from app.deps import get_current_user
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

# Variables de configuración JWT
JWT_SECRET = os.getenv("JWT_SECRET", "secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRES_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES", "60"))

# Debug
print(f"🔑 JWT_SECRET cargado: {JWT_SECRET}")

def hash_password(password: str) -> str:
    """Hashea una contraseña usando bcrypt directamente"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica una contraseña contra su hash"""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_access_token(user_id: int) -> str:
    """Crea un JWT token para el usuario"""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    to_encode = {"sub": str(user_id), "exp": expire}  # ← CONVERTIR A STRING
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserIn, session: Session = Depends(get_session)):
    """
    Registra un nuevo usuario
    - Username debe ser único
    - Password se hashea antes de guardar
    """
    # Verificar si el username ya existe
    statement = select(User).where(User.username == user_in.username)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El username ya está registrado"
        )
    
    # Crear nuevo usuario
    hashed_password = hash_password(user_in.password)
    new_user = User(username=user_in.username, password_hash=hashed_password)
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=TokenOut)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """
    Login de usuario
    - Retorna un JWT token si las credenciales son válidas
    """
    # Buscar usuario por username
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()
    
    # Verificar usuario y contraseña
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username o password incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token
    access_token = create_access_token(user.id)
    
    return TokenOut(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    """
    Retorna información del usuario autenticado
    - Requiere JWT token válido
    """
    return current_user