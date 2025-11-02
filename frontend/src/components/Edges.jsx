import { useState, useEffect } from 'react';
import { getEdges, createEdge, deleteEdge, getNodes } from '../api';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import './CrudSection.css';

function Edges() {
  const [edges, setEdges] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [srcId, setSrcId] = useState('');
  const [dstId, setDstId] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    fetchEdges();
    fetchNodes();
  }, []);

  const fetchEdges = async () => {
    try {
      const data = await getEdges();
      setEdges(data);
    } catch (err) {
      showError('Error al cargar aristas');
      console.error(err);
    }
  };

  const fetchNodes = async () => {
    try {
      const data = await getNodes();
      setNodes(data);
    } catch (err) {
      console.error('Error al cargar nodos:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createEdge(srcId, dstId, weight);
      setSrcId('');
      setDstId('');
      setWeight('');
      fetchEdges();
      success(`Arista creada: ${getNodeName(srcId)} → ${getNodeName(dstId)} (peso: ${weight})`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al crear arista';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await deleteEdge(confirmDelete.id);
      fetchEdges();
      success('Arista eliminada exitosamente');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al eliminar arista';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setConfirmDelete(null);
    }
  };

  const getNodeName = (id) => {
    const node = nodes.find((n) => n.id === parseInt(id));
    return node ? node.name : `ID ${id}`;
  };

  return (
    <>
      <div className="crud-section">
        <div className="section-header">
          <h3>🔗 Gestión de Aristas</h3>
          <span className="badge">{edges.length} aristas</span>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="crud-form edges-form">
          <select
            value={srcId}
            onChange={(e) => setSrcId(e.target.value)}
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

          <span className="arrow">→</span>

          <select
            value={dstId}
            onChange={(e) => setDstId(e.target.value)}
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

          <input
            type="number"
            step="0.1"
            placeholder="Peso (ej: 28.5)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            className="input-modern weight-input"
          />

          <button type="submit" disabled={loading} className="btn-create">
            {loading ? '⏳ Creando...' : '➕ Crear Arista'}
          </button>
        </form>

        <div className="items-list">
          {edges.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔗</span>
              <p>No hay aristas</p>
              <small>Crea la primera conexión entre nodos</small>
            </div>
          ) : (
            <div className="items-grid">
              {edges.map((edge) => (
                <div key={edge.id} className="item-card edge-card">
                  <div className="item-content">
                    <div className="item-icon">🔗</div>
                    <div className="item-info">
                      <span className="item-id">ID: {edge.id}</span>
                      <h4 className="item-name">
                        {getNodeName(edge.src_id)} → {getNodeName(edge.dst_id)}
                      </h4>
                      <span className="weight-badge">Peso: {edge.weight}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmDelete({ id: edge.id })}
                    className="btn-delete"
                    title="Eliminar arista"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
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

      {/* Confirm Dialog */}
      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar Arista"
          message="¿Estás seguro de eliminar esta arista?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
}

export default Edges;