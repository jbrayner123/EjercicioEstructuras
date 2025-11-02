from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlmodel import Session, select
from app.db import get_session
from app.models import User
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Usar HTTPBearer en lugar de OAuth2PasswordBearer
security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET", "secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# Debug: imprimir el JWT_SECRET al cargar
print(f"🔑 JWT_SECRET en deps: {JWT_SECRET}")

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """
    Valida el JWT token y retorna el usuario actual
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        print(f"🔍 Token recibido: {token[:50]}...")
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        print(f"✅ Payload decodificado: {payload}")
        
        user_id_str = payload.get("sub")
        if user_id_str is None:
            print("❌ No hay 'sub' en el payload")
            raise credentials_exception
        
        user_id = int(user_id_str)  # ← Convertir de string a int
        print(f"🔍 Buscando usuario con ID: {user_id}")
        
    except JWTError as e:
        print(f"❌ Error JWT: {e}")
        raise credentials_exception
    except ValueError as e:
        print(f"❌ Error convirtiendo user_id: {e}")
        raise credentials_exception
    
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    
    if user is None:
        print(f"❌ Usuario {user_id} no encontrado en BD")
        raise credentials_exception
    
    print(f"✅ Usuario autenticado: {user.username}")
    return user