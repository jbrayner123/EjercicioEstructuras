# PathFinder Minimal Starter — Taller (1 semana)
**Tema:** API + SPA para explorar rutas en un grafo  
**Stack:** FastAPI · SQLite (SQLModel/SQLAlchemy) · JWT · React (Vite)  
**Algoritmos:** BFS (árbol BFS) y Dijkstra (camino mínimo)  
**Entrega:** **martes, 4 de noviembre de 2025, 23:59**  

---

## 1) Propósito del taller
Construir un MVP (producto mínimo viable) que:
- Autentique usuarios con **JWT** (registro, login, `me`).
- Exponga un CRUD protegido para **nodos** y **aristas** (grafo persistido en **SQLite**).
- Ofrezca endpoints para **BFS** y **Dijkstra**.
- Consuma la API desde un **frontend React** con sesión (token) y muestre resultados.


---

## 2) Alcance funcional (requerido)
### 2.1 Autenticación (pública / protegida)
- `POST /auth/register` → crea usuario (username único, password **hasheado**).
- `POST /auth/login` → retorna `{ access_token, token_type="bearer" }`.  
- `GET /auth/me` → retorna `{ id, username }` del usuario autenticado (requiere `Authorization: Bearer <token>`).

**Reglas:**
- Contraseñas **nunca** en texto plano ni en respuestas.
- JWT con expiración (p. ej. 30–60 min) y secreto configurable por `.env`.

### 2.2 Grafo (protegido, requiere JWT)
- **Nodos**
  - `POST /graph/nodes` (body: `{ name }`) → 201 `{ id, name }`
  - `GET  /graph/nodes` → 200 `[{ id, name }]`
  - `DELETE /graph/nodes/{id}` → 204 (borrar aristas incidentes)
- **Aristas**
  - `POST /graph/edges` (body: `{ src_id, dst_id, weight>0 }`) → 201 `{ id, src_id, dst_id, weight }`
  - `GET  /graph/edges` → 200 `[{ id, src_id, dst_id, weight }]`
  - `DELETE /graph/edges/{id}` → 204

**Validaciones y errores:**
- `name` de nodo **único**.
- `weight` **> 0** (float).
- `src_id` y `dst_id` deben existir (400 si no).
- 404 para recursos inexistentes.
- Mensajes de error claros (`detail`).

### 2.3 Algoritmos (protegido)
- **BFS**: `GET /graph/bfs?start_id=ID` → 200  
  ```json
  {
    "order": [1,2,5,3],
    "tree": [
      {"node_id": 1, "parent_id": null, "depth": 0},
      {"node_id": 2, "parent_id": 1, "depth": 1}
    ]
  }
  ```
  - Debe devolver el **árbol BFS** (relación padre/hijo + profundidad).
- **Dijkstra**: `GET /graph/shortest-path?src_id=ID&dst_id=ID` → 200  
  ```json
  {"path": [1,5,7,9], "distance": 42.0}
  ```
  - Pesos **positivos**.
  - 404 si **no** existe ruta entre `src_id` y `dst_id`.

> **Nota:** puedes usar grafo dirigido (como viene el dataset). Si decides no dirigido, documenta la decisión.

---

## 3) Datos y semilla
En el repo base encontrarás:
- `backend/data/nodes.csv` con una lista de nombres de ciudades.
- `backend/data/edges.csv` con `src_name,dst_name,weight`.

**Tarea:** implementar un **script de carga** (por ejemplo `backend/scripts/load_seed.py`) que:
1. Cree tablas (si no existen).
2. Inserte nodos (mapeando `name → id`).
3. Inserte aristas respetando `src_name` y `dst_name`.  
4. Sea **idempotente** (si corres dos veces no duplica datos).

---

## 4) Frontend (React + Vite)
### 4.1 Pantallas mínimas
- **Login** (pública):  
  - Formulario para username/password.  
  - Al autenticarse, guarda token en `localStorage` y redirige al Home.
- **Home protegida** (requiere token):  
  - Secciones para **Nodos** y **Aristas**: formularios de creación + listas con eliminación.  
  - Sección **Algoritmos**:  
    - Ejecutar **BFS** (input `start_id`) y mostrar `order` + tabla/resumen del **árbol BFS**.  
    - Ejecutar **Dijkstra** (`src_id`, `dst_id`) y mostrar `path` + `distance`.

### 4.2 Reglas UI
- Si un request a endpoint protegido responde **401**, limpia token y redirige a **/login**.
- Muestra errores de validación del backend de forma visible.

---

## 5) Requisitos técnicos y de seguridad
- **Backend**
  - FastAPI + SQLModel/SQLAlchemy + SQLite.
  - CORS habilitado para `http://localhost:5173`.
  - Password hashing con **bcrypt** (passlib).
  - **.env** con: `JWT_SECRET`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRES_MINUTES`, `SQLITE_URL`, `CORS_ORIGINS`.
  - No subir `.env` con secretos reales.

- **Frontend**
  - `VITE_API_URL` opcional para apuntar a otra URL de la API.
  - Envío de `Authorization: Bearer <token>` en endpoints protegidos.

---

## 6) Pasos de trabajo sugeridos (checklist)
1. **Entorno**
   - Instala dependencias Python con **uv** o venv + pip.  
   - Instala dependencias del frontend (`npm install`).

2. **DB & modelos**
   - Implementa `backend/app/db.py` (`engine`, `get_session`, `init_db`).
   - Revisa/ajusta `backend/app/models.py` (User, Node, Edge).  
   - En el arranque de la app, asegura creación de tablas.

3. **Auth (JWT)**
   - Implementa `POST /auth/register`, `POST /auth/login`, `GET /auth/me`.  
   - Crea `get_current_user` (decodifica JWT, busca usuario, maneja 401).

4. **CRUD grafo**
   - Implementa endpoints de nodos y aristas con validaciones y 404/400 apropiados.

5. **Algoritmos**
   - Implementa **BFS** (cola, `visited`, `parent`, `depth`).  
   - Implementa **Dijkstra** (heapq, `dist`, `prev`, reconstrucción de camino).

6. **Semilla**
   - Implementa el **script de carga** desde CSV y ejecútalo.

7. **Frontend**
   - Login + almacenamiento de token + protección de rutas.  
   - Formularios/listas de nodos y aristas.  
   - UI para **BFS** y **Dijkstra** mostrando resultados.

8. **README del equipo**
   - Documenta: cómo correr backend/frontend, cómo cargar la semilla, variables de entorno, decisiones técnicas, limitaciones y mejoras.

---

## 7) Pruebas manuales mínimas (ejemplos con `curl`)
> Ajusta puertos/URLs si cambiaste configuración.

```bash
# Registro
curl -X POST http://localhost:8000/auth/register   -H "Content-Type: application/json"   -d '{"username":"demo","password":"1234"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login   -H "Content-Type: application/x-www-form-urlencoded"   -d "username=demo&password=1234" | jq -r .access_token)

# Perfil
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/auth/me

# Crear nodo
curl -X POST http://localhost:8000/graph/nodes   -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"name":"Cali"}'

# Listar nodos
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/graph/nodes

# Crear arista
curl -X POST http://localhost:8000/graph/edges   -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"src_id":1,"dst_id":2,"weight":28}'

# BFS
curl -H "Authorization: Bearer $TOKEN"   "http://localhost:8000/graph/bfs?start_id=1"

# Dijkstra
curl -H "Authorization: Bearer $TOKEN"   "http://localhost:8000/graph/shortest-path?src_id=1&dst_id=3"
```

---

## 8) Criterios de aceptación
- **Auth JWT** funcional: alta/baja de usuarios, login, `me`, protección efectiva.
- **CRUD** nodos y aristas con validaciones y manejo de errores.
- **BFS**: `order` y `tree` correctos (parent y depth coherentes).
- **Dijkstra**: `path` y `distance` correctos; 404 si no hay ruta.
- **Frontend**: login/token, CRUD usable, ejecución de algoritmos y visualización clara.
- **Semilla**: script de carga desde CSV reproducible e idempotente.
- **README** claro con pasos de ejecución.

---

## 9) Rúbrica de evaluación (100 pts)
- **Auth y seguridad (20 pts)**  
  - Registro/login (8), `me` y protección (6), hashing/expiración/JWT correcto (6)
- **CRUD grafo (20 pts)**  
  - Nodos (10), Aristas (10) con validaciones (peso>0, FKs, 400/404)
- **Algoritmos (25 pts)**  
  - BFS (árbol + orden) (12), Dijkstra (camino + distancia) (13)
- **Frontend (25 pts)**  
  - Login/token + protección (10), CRUD (10), vistas de resultados (5)
- **Semilla + Documentación (10 pts)**  
  - Script de carga (6), README claro (4)

**Extras opcionales (+ hasta 10 pts):**  
- Visualización del grafo (librería de gráficos).  
- Export del árbol BFS a JSON/CSV.  
- Tests básicos (backend o frontend).

---

## 10) Entrega
- **Repositorio Git** (público o privado con acceso al docente).  
- **Video demo (5–7 min)** mostrando: login → CRUD → BFS/Dijkstra → resultados.  
- **README del equipo** (en la raíz):  
  - Requisitos, env vars, comandos backend/frontend.  
  - Pasos de carga del dataset.  
  - Decisiones técnicas, limitaciones y mejoras.

> **Fecha límite:** **4 de noviembre de 2025, 23:59**.  
> Sugerencia: realiza commits periódicos y mensajes descriptivos.

---

## 11) Recomendaciones finales
- Maneja **401/403/404/400** correctamente y no filtres trazas internas al cliente.  
- Controla CORS para el origen del frontend.  
- No subas **secrets** al repo.  
- Mantén el código organizado y con nombres claros.  
- Verifica que el backend arranca sin errores y que el frontend funciona sin token y con token.

¡Éxitos!
