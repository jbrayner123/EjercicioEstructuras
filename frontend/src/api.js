import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401 (token inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await axios.post(`${API_URL}/auth/login`, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  
  return response.data;
};

export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    username,
    password,
  });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ==================== NODES ====================

export const getNodes = async () => {
  const response = await api.get('/graph/nodes');
  return response.data;
};

export const createNode = async (name) => {
  const response = await api.post('/graph/nodes', { name });
  return response.data;
};

export const deleteNode = async (id) => {
  await api.delete(`/graph/nodes/${id}`);
};

// ==================== EDGES ====================

export const getEdges = async () => {
  const response = await api.get('/graph/edges');
  return response.data;
};

export const createEdge = async (src_id, dst_id, weight) => {
  const response = await api.post('/graph/edges', {
    src_id: parseInt(src_id),
    dst_id: parseInt(dst_id),
    weight: parseFloat(weight),
  });
  return response.data;
};

export const deleteEdge = async (id) => {
  await api.delete(`/graph/edges/${id}`);
};

// ==================== ALGORITHMS ====================

export const runBFS = async (start_id) => {
  const response = await api.get(`/graph/bfs?start_id=${start_id}`);
  return response.data;
};

export const runDijkstra = async (src_id, dst_id) => {
  const response = await api.get(
    `/graph/shortest-path?src_id=${src_id}&dst_id=${dst_id}`
  );
  return response.data;
};

export default api;