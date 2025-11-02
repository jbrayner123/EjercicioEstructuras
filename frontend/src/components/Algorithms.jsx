import { useState, useEffect } from 'react';
import { runBFS, runDijkstra, getNodes } from '../api';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';
import './Algorithms.css';

function Algorithms() {
  const [nodes, setNodes] = useState([]);
  const [bfsStartId, setBfsStartId] = useState('');
  const [bfsResult, setBfsResult] = useState(null);
  const [dijkstraSrcId, setDijkstraSrcId] = useState('');
  const [dijkstraDstId, setDijkstraDstId] = useState('');
  const [dijkstraResult, setDijkstraResult] = useState(null);
  const [error, setError] = useState('');
  const [loadingBfs, setLoadingBfs] = useState(false);
  const [loadingDijkstra, setLoadingDijkstra] = useState(false);

  const { toasts, removeToast, success, error: showError, info } = useToast();

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const data = await getNodes();
      setNodes(data);
    } catch (err) {
      console.error('Error al cargar nodos:', err);
    }
  };

  const handleBFS = async (e) => {
    e.preventDefault();
    setError('');
    setBfsResult(null);
    setLoadingBfs(true);

    try {
      info('Ejecutando BFS...');
      const result = await runBFS(bfsStartId);
      setBfsResult(result);
      success(`BFS completado! Se exploraron ${result.order.length} nodos`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al ejecutar BFS';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoadingBfs(false);
    }
  };

  const handleDijkstra = async (e) => {
    e.preventDefault();
    setError('');
    setDijkstraResult(null);
    setLoadingDijkstra(true);

    try {
      info('Calculando camino más corto...');
      const result = await runDijkstra(dijkstraSrcId, dijkstraDstId);
      setDijkstraResult(result);
      success(`¡Camino encontrado! Distancia total: ${result.distance} unidades`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al ejecutar Dijkstra. Verifica que exista un camino entre los nodos.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoadingDijkstra(false);
    }
  };

  const getNodeName = (id) => {
    const node = nodes.find((n) => n.id === id);
    return node ? node.name : `ID ${id}`;
  };

  return (
    <>
      <div className="algorithms-container">
        <div className="algo-header">
          <h3>🧮 Algoritmos de Búsqueda</h3>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="algorithms-grid">
          {/* BFS Section */}
          <div className="algorithm-section bfs-section">
            <div className="algo-card">
              <div className="algo-title">
                <span className="algo-icon">🔍</span>
                <h4>BFS (Breadth-First Search)</h4>
              </div>
              <p className="algo-description">
                Búsqueda en amplitud: explora el grafo nivel por nivel desde un nodo inicial.
              </p>

              <form onSubmit={handleBFS} className="algo-form">
                <select
                  value={bfsStartId}
                  onChange={(e) => setBfsStartId(e.target.value)}
                  required
                  className="select-modern"
                >
                  <option value="">Selecciona nodo inicial</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.id} - {node.name}
                    </option>
                  ))}
                </select>

                <button type="submit" disabled={loadingBfs} className="btn-execute">
                  {loadingBfs ? '⏳ Ejecutando...' : '▶️ Ejecutar BFS'}
                </button>
              </form>

              {bfsResult && (
                <div className="result-container">
                  <div className="result-header">
                    <span>✅ Resultado BFS</span>
                  </div>

                  <div className="result-section">
                    <h5>📋 Orden de recorrido:</h5>
                    <div className="order-list">
                      {bfsResult.order.map((nodeId, index) => (
                        <span key={index} className="order-item">
                          {getNodeName(nodeId)}
                          {index < bfsResult.order.length - 1 && ' → '}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="result-section">
                    <h5>🌳 Árbol BFS:</h5>
                    <div className="tree-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Nodo</th>
                            <th>Padre</th>
                            <th>Profundidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bfsResult.tree.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <strong>{getNodeName(item.node_id)}</strong>
                              </td>
                              <td>
                                {item.parent_id ? getNodeName(item.parent_id) : '—'}
                              </td>
                              <td>
                                <span className="depth-badge">{item.depth}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dijkstra Section */}
          <div className="algorithm-section dijkstra-section">
            <div className="algo-card">
              <div className="algo-title">
                <span className="algo-icon">🛣️</span>
                <h4>Dijkstra (Camino más corto)</h4>
              </div>
              <p className="algo-description">
                Encuentra el camino más corto entre dos nodos considerando los pesos de las aristas.
              </p>

              <form onSubmit={handleDijkstra} className="algo-form">
                <select
                  value={dijkstraSrcId}
                  onChange={(e) => setDijkstraSrcId(e.target.value)}
                  required
                  className="select-modern"
                >
                  <option value="">Nodo origen</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.id} - {node.name}
                    </option>
                  ))}
                </select>

                <select
                  value={dijkstraDstId}
                  onChange={(e) => setDijkstraDstId(e.target.value)}
                  required
                  className="select-modern"
                >
                  <option value="">Nodo destino</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.id} - {node.name}
                    </option>
                  ))}
                </select>

                <button type="submit" disabled={loadingDijkstra} className="btn-execute">
                  {loadingDijkstra ? '⏳ Calculando...' : '▶️ Ejecutar Dijkstra'}
                </button>
              </form>

              {dijkstraResult && (
                <div className="result-container">
                  <div className="result-header">
                    <span>✅ Camino encontrado</span>
                  </div>

                  <div className="result-section">
                    <h5>🗺️ Ruta óptima:</h5>
                    <div className="path-display">
                      {dijkstraResult.path.map((nodeId, index) => (
                        <span key={index} className="path-node">
                          {getNodeName(nodeId)}
                          {index < dijkstraResult.path.length - 1 && (
                            <span className="path-arrow">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="result-section">
                    <h5>📏 Distancia total:</h5>
                    <div className="distance-display">
                      <span className="distance-value">{dijkstraResult.distance}</span>
                      <span className="distance-label">unidades</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
}

export default Algorithms;