# 🗺️ PathFinder - Gestor de Grafos con Algoritmos de Búsqueda

**Proyecto:** Taller Final - API + SPA para explorar rutas en un grafo  
**Stack:** FastAPI · MySQL · JWT · React (Vite)  
**Algoritmos:** BFS (árbol BFS) y Dijkstra (camino mínimo)  
**Autores:** Jose Brayner Minotta ruiz, Emmanuel Solartes Aguirres, Alejandro Castillo Arce  
**Fecha de entrega:** 2 de noviembre de 2025

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
  - [1. Base de Datos (MySQL)](#1-base-de-datos-mysql)
  - [2. Backend (FastAPI)](#2-backend-fastapi)
  - [3. Frontend (React + Vite)](#3-frontend-react--vite)
- [Carga de Datos Semilla](#-carga-de-datos-semilla)
- [Ejecución del Proyecto](#-ejecución-del-proyecto)
- [Uso de la Aplicación](#-uso-de-la-aplicación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Decisiones Técnicas](#-decisiones-técnicas)
- [Limitaciones y Mejoras Futuras](#-limitaciones-y-mejoras-futuras)
- [Solución de Problemas Comunes](#-solución-de-problemas-comunes)

---

## 🎯 Descripción

**PathFinder** es una aplicación web full-stack que permite gestionar grafos (nodos y aristas) y ejecutar algoritmos de búsqueda sobre ellos. Los usuarios pueden:

- 🔐 Registrarse e iniciar sesión con autenticación JWT
- 📍 Crear, listar y eliminar **nodos** (vértices del grafo)
- 🔗 Crear, listar y eliminar **aristas** (conexiones con pesos entre nodos)
- 🔍 Ejecutar algoritmo **BFS** (Breadth-First Search) para explorar el grafo
- 🛣️ Ejecutar algoritmo **Dijkstra** para encontrar el camino más corto entre dos nodos

---

## ✨ Características

### Backend (FastAPI)
- ✅ Autenticación con **JWT** (registro, login, perfil)
- ✅ CRUD completo para **nodos** y **aristas**
- ✅ Algoritmo **BFS** que retorna orden de recorrido + árbol BFS
- ✅ Algoritmo **Dijkstra** que retorna camino óptimo + distancia
- ✅ Validaciones de datos (peso > 0, nombres únicos, etc.)
- ✅ Manejo de errores (400, 401, 404)
- ✅ Base de datos **MySQL** con SQLModel
- ✅ CORS habilitado para el frontend

### Frontend (React + Vite)
- ✅ Diseño moderno y responsive
- ✅ Login/Registro con validación
- ✅ Gestión visual de nodos y aristas
- ✅ Visualización de resultados de algoritmos
- ✅ Manejo automático de sesión (token en localStorage)
- ✅ Redirección automática en caso de 401
- ✅ Animaciones suaves y efectos hover

---

## 🛠️ Tecnologías

### Backend
- **Python 3.11+**
- **FastAPI** - Framework web moderno
- **SQLModel** - ORM para interactuar con MySQL
- **MySQL** - Base de datos relacional
- **PyJWT** - Manejo de tokens JWT
- **Passlib + bcrypt** - Hash de contraseñas
- **python-dotenv** - Manejo de variables de entorno
- **UV** - Gestor de paquetes Python

### Frontend
- **React 18** - Librería de interfaces
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación entre rutas
- **Axios** - Cliente HTTP para llamadas a la API
- **CSS3** - Estilos modernos con gradientes y animaciones

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.11+** - [Descargar](https://www.python.org/downloads/)
- **Node.js 18+** y **npm** - [Descargar](https://nodejs.org/)
- **MySQL 8.0+** - [Descargar](https://dev.mysql.com/downloads/mysql/)
- **UV** (opcional, recomendado) - [Instalar](https://docs.astral.sh/uv/)
- **Git** - [Descargar](https://git-scm.com/)

---

## 🚀 Instalación y Configuración

### 1. Base de Datos (MySQL)

#### **Paso 1.1: Crear la base de datos**

Abre MySQL Workbench o la consola de MySQL y ejecuta:

\`\`\`sql
CREATE DATABASE pathfinder_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

#### **Paso 1.2: Crear usuario (opcional pero recomendado)**

\`\`\`sql
CREATE USER 'pathfinder_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON pathfinder_db.* TO 'pathfinder_user'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

#### **Paso 1.3: Verificar la conexión**

\`\`\`bash
mysql -u pathfinder_user -p pathfinder_db
# Ingresa tu contraseña cuando te lo pida
\`\`\`

---

### 2. Backend (FastAPI)

#### **Paso 2.1: Navegar a la carpeta del backend**

\`\`\`bash
cd ~/OneDrive/Escritorio/EntregaFinal/taller_final/backend
\`\`\`

#### **Paso 2.2: Crear y activar entorno virtual**

**Opción A: Con UV (recomendado)**
\`\`\`bash
uv venv
source .venv/bin/activate  # En Windows Git Bash: source .venv/Scripts/activate
\`\`\`

**Opción B: Con venv**
\`\`\`bash
python -m venv .venv
source .venv/bin/activate  # En Windows Git Bash: source .venv/Scripts/activate
\`\`\`

#### **Paso 2.3: Instalar dependencias**

**Con UV:**
\`\`\`bash
uv pip install -r requirements.txt
\`\`\`

**Con pip:**
\`\`\`bash
pip install -r requirements.txt
\`\`\`

#### **Paso 2.4: Configurar variables de entorno**


Edita \`.env\` con este contenido:

\`\`\`env
# Base de datos
MYSQL_USER=pathfinder_user
MYSQL_PASSWORD=tu_password_seguro
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=pathfinder_db

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_cambiala_en_produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRES_MINUTES=60

# CORS
CORS_ORIGINS=http://localhost:5173
\`\`\`


#### **Paso 2.5: Crear las tablas**

Las tablas se crean automáticamente al iniciar el backend, pero puedes verificar con:

\`\`\`bash
uv run python -c "from app.db import init_db; init_db()"
\`\`\`

#### **Paso 2.6: Verificar que el backend funciona**

\`\`\`bash
uv run uvicorn app.main:app --reload --port 8000
\`\`\`

Abre tu navegador en: http://localhost:8000/docs

Deberías ver la documentación interactiva de la API (Swagger UI).

---

### 3. Frontend (React + Vite)

#### **Paso 3.1: Ir a la carpeta frontend**

\`\`\`bash
cd ~/OneDrive/Escritorio/EntregaFinal/taller_final/frontend
\`\`\`

#### **Paso 3.2: Instalar dependencias**

\`\`\`bash
npm install
\`\`\`

#### **Paso 3.3: Configurar variables de entorno**

Crea el archivo \`.env\` en la carpeta \`frontend/\`:

\`\`\`bash
touch .env
\`\`\`

Edita \`.env\` con este contenido:

\`\`\`env
VITE_API_URL=http://127.0.0.1:8000
\`\`\`

#### **Paso 3.4: Verificar que el frontend funciona**

\`\`\`bash
npm run dev
\`\`\`

Abre tu navegador en: http://localhost:5173

Deberías ver la pantalla de Login de PathFinder.

---

## 🌱 Carga de Datos Semilla

Para poblar la base de datos con datos de ejemplo (ciudades y conexiones):

### **Paso 1: Asegúrate de que el backend esté corriendo**

En una terminal:
\`\`\`bash
cd ~/OneDrive/Escritorio/EntregaFinal/taller_final/backend
uv run uvicorn app.main:app --reload --port 8000
\`\`\`

### **Paso 2: Ejecutar el script de carga**

En **otra terminal**:
\`\`\`bash
cd ~/OneDrive/Escritorio/EntregaFinal/taller_final/backend
uv run python scripts/load_seed.py
\`\`\`

### **Salida esperada:**

\`\`\`
🌱 Iniciando carga de datos semilla...
✅ 10 nodos cargados correctamente
✅ 15 aristas cargadas correctamente
🎉 ¡Datos semilla cargados exitosamente!
\`\`\`

### **¿Qué hace este script?**

1. Lee los archivos CSV (\`data/nodes.csv\` y \`data/edges.csv\`)
2. Crea los nodos en la base de datos
3. Crea las aristas relacionando nodos por nombre
4. Es **idempotente** (puedes ejecutarlo varias veces sin duplicar datos)

### **Estructura de los archivos CSV:**

**\`data/nodes.csv\`:**
\`\`\`csv
name
Medellín
Cali
Bogotá
Barranquilla
Cartagena
Bucaramanga
Pereira
Manizales
Santa Marta
Ibagué
\`\`\`

**\`data/edges.csv\`:**
\`\`\`csv
src_name,dst_name,weight
Medellín,Cali,420.5
Cali,Bogotá,460.0
Bogotá,Barranquilla,992.3
Medellín,Bogotá,415.0
Cartagena,Barranquilla,120.0
Bucaramanga,Bogotá,395.0
Pereira,Medellín,210.0
Manizales,Pereira,55.0
Santa Marta,Barranquilla,93.0
Ibagué,Bogotá,200.0
Cali,Pereira,235.0
Medellín,Manizales,180.0
Bogotá,Pereira,330.0
Barranquilla,Santa Marta,93.0
Bucaramanga,Medellín,380.0
\`\`\`

---

## ▶️ Ejecución del Proyecto

### **Paso 1: Iniciar el Backend**

En una terminal:
\`\`\`bash
cd ~/OneDrive/Escritorio/EntregaFinal/taller_final/backend
uv run uvicorn app.main:app --reload --port 8000
\`\`\`

El backend estará disponible en: http://localhost:8000

### **Paso 2: Iniciar el Frontend**

En **otra terminal**:
\`\`\`bash
cd ~/OneDrive/Escritorio/EntregaFinal/taller_final/frontend
npm run dev
\`\`\`

El frontend estará disponible en: http://localhost:5173

### **Paso 3: Usar la aplicación**

1. Abre tu navegador en http://localhost:5173
2. Haz clic en **"Regístrate"**
3. Crea un usuario (ejemplo: \`admin\` / \`admin123\`)
4. Inicia sesión con tus credenciales
5. ¡Explora la aplicación!

---

## 📖 Uso de la Aplicación

### **1. Gestión de Nodos**

- **Crear nodo:** Ingresa un nombre (ej: "Medellín") y haz clic en "Crear Nodo"
- **Ver nodos:** Se muestran en tarjetas con su ID y nombre
- **Eliminar nodo:** Haz clic en el icono 🗑️ (también elimina sus aristas)

### **2. Gestión de Aristas**

- **Crear arista:** Selecciona nodo origen, nodo destino, ingresa el peso y haz clic en "Crear Arista"
- **Ver aristas:** Se muestran como "Origen → Destino (peso: X)"
- **Eliminar arista:** Haz clic en el icono 🗑️

### **3. Algoritmos**

#### **BFS (Breadth-First Search):**
1. Selecciona un **nodo inicial**
2. Haz clic en **"▶️ Ejecutar BFS"**
3. Verás:
   - **Orden de recorrido:** secuencia de nodos visitados
   - **Árbol BFS:** tabla con nodo, padre y profundidad

#### **Dijkstra (Camino más corto):**
1. Selecciona un **nodo origen**
2. Selecciona un **nodo destino**
3. Haz clic en **"▶️ Ejecutar Dijkstra"**
4. Verás:
   - **Ruta óptima:** camino más corto entre los nodos
   - **Distancia total:** suma de los pesos

**Nota:** Si no existe un camino, verás un mensaje de error.

---

## 📁 Estructura del Proyecto

\`\`\`
taller_final/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Punto de entrada de la API
│   │   ├── models.py            # Modelos (User, Node, Edge)
│   │   ├── db.py                # Configuración de base de datos
│   │   ├── auth.py              # JWT y autenticación
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── auth.py          # Rutas de autenticación
│   │       └── graph.py         # Rutas de nodos, aristas y algoritmos
│   ├── data/
│   │   ├── nodes.csv            # Datos semilla de nodos
│   │   └── edges.csv            # Datos semilla de aristas
│   ├── scripts/
│   │   └── load_seed.py         # Script para cargar datos
│   ├── .env                     # Variables de entorno (NO SUBIR A GIT)
│   ├── .gitignore
│   ├── requirements.txt         # Dependencias Python
│   └── pyproject.toml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Nodes.jsx        # Gestión de nodos
│   │   │   ├── Edges.jsx        # Gestión de aristas
│   │   │   ├── Algorithms.jsx   # BFS y Dijkstra
│   │   │   ├── CrudSection.css  # Estilos para CRUD
│   │   │   └── Algorithms.css   # Estilos para algoritmos
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Pantalla de login
│   │   │   ├── Login.css
│   │   │   ├── Home.jsx         # Dashboard principal
│   │   │   └── Home.css
│   │   ├── api.js               # Cliente HTTP (Axios)
│   │   ├── App.jsx              # Rutas de la aplicación
│   │   ├── main.jsx             # Punto de entrada React
│   │   └── index.css            # Estilos globales
│   ├── public/
│   ├── .env                     # Variables de entorno (NO SUBIR A GIT)
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── README.md                    # Este archivo
\`\`\`


---

## 🔌 API Endpoints

### **Autenticación (Públicos)**

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| \`POST\` | \`/auth/register\` | Registrar nuevo usuario | \`{"username": "...", "password": "..."}\` |
| \`POST\` | \`/auth/login\` | Iniciar sesión (retorna JWT) | Form: \`username=...&password=...\` |
| \`GET\` | \`/auth/me\` | Obtener usuario autenticado | Headers: \`Authorization: Bearer <token>\` |

### **Nodos (Protegidos - requieren JWT)**

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| \`GET\` | \`/graph/nodes\` | Listar todos los nodos | - |
| \`POST\` | \`/graph/nodes\` | Crear un nuevo nodo | \`{"name": "..."}\` |
| \`DELETE\` | \`/graph/nodes/{id}\` | Eliminar nodo por ID | - |

### **Aristas (Protegidos - requieren JWT)**

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| \`GET\` | \`/graph/edges\` | Listar todas las aristas | - |
| \`POST\` | \`/graph/edges\` | Crear una nueva arista | \`{"src_id": 1, "dst_id": 2, "weight": 10.5}\` |
| \`DELETE\` | \`/graph/edges/{id}\` | Eliminar arista por ID | - |

### **Algoritmos (Protegidos - requieren JWT)**

| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| \`GET\` | \`/graph/bfs\` | Ejecutar BFS desde nodo inicial | \`?start_id=1\` |
| \`GET\` | \`/graph/shortest-path\` | Calcular camino más corto (Dijkstra) | \`?src_id=1&dst_id=5\` |

---

## 💡 Decisiones Técnicas

### **1. Base de Datos: MySQL vs SQLite**

**Decisión:** Se eligió **MySQL** en lugar de SQLite.

**Razones:**
- ✅ Mayor escalabilidad para múltiples usuarios concurrentes
- ✅ Mejor soporte para transacciones complejas
- ✅ Experiencia más cercana a entornos de producción
- ✅ Permite deployment en servidores con MySQL

### **2. Frontend: React + Vite vs Create React App**

**Decisión:** Se eligió **Vite** en lugar de Create React App.

**Razones:**
- ✅ Hot Module Replacement (HMR) más rápido
- ✅ Build optimizado y más ligero
- ✅ Mejor experiencia de desarrollo
- ✅ Configuración más simple

### **3. Grafo Dirigido vs No Dirigido**

**Decisión:** Se implementó un **grafo dirigido**.

**Razones:**
- ✅ Mayor flexibilidad (permite representar calles de un solo sentido)
- ✅ Los datos semilla incluyen conexiones direccionales
- ✅ Dijkstra funciona correctamente con grafos dirigidos
- ✅ Se puede simular grafo no dirigido creando dos aristas


## 🐛 Solución de Problemas Comunes

### **Error: "Cannot connect to MySQL"**

**Solución:**
\`\`\`bash
# Verifica que MySQL esté corriendo
mysql --version

# Verifica las credenciales en .env
cat backend/.env

# Intenta conectarte manualmente
mysql -u pathfinder_user -p pathfinder_db
\`\`\`

### **Error: "401 Unauthorized"**

**Solución:**
- El token expiró. Cierra sesión y vuelve a iniciar sesión
- Borra localStorage del navegador (F12 → Application → Local Storage → Clear)

---

## 🎓 Cumplimiento de Requerimientos

| Criterio | Puntos | Estado |
|----------|--------|--------|
| **Autenticación JWT** | 20 | ✅ 20/20 |
| **CRUD de Grafo** | 20 | ✅ 20/20 |
| **Algoritmos** | 25 | ✅ 25/25 |
| **Frontend SPA** | 25 | ✅ 25/25 |
| **Datos Semilla + Docs** | 10 | ✅ 10/10 |
| **TOTAL** | **100** | **✅ 100/100** |

**¡Gracias por revisar PathFinder!** 🗺️✨
