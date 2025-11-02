import { useState, useEffect } from 'react';
import { getNodes, createNode, deleteNode } from '../api';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import './CrudSection.css';

function Nodes() {
  const [nodes, setNodes] = useState([]);
  const [newNodeName, setNewNodeName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const data = await getNodes();
      setNodes(data);
    } catch (err) {
      showError('Error al cargar nodos');
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createNode(newNodeName);
      setNewNodeName('');
      fetchNodes();
      success(`Nodo "${newNodeName}" creado exitosamente`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al crear nodo';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await deleteNode(confirmDelete.id);
      fetchNodes();
      success(`Nodo "${confirmDelete.name}" eliminado exitosamente`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al eliminar nodo';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <>
      <div className="crud-section">
        <div className="section-header">
          <h3>📍 Gestión de Nodos</h3>
          <span className="badge">{nodes.length} nodos</span>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="crud-form">
          <input
            type="text"
            placeholder="Nombre del nodo (ej: Medellín)"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            required
            className="input-modern"
          />
          <button type="submit" disabled={loading} className="btn-create">
            {loading ? '⏳ Creando...' : '➕ Crear Nodo'}
          </button>
        </form>

        <div className="items-list">
          {nodes.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📍</span>
              <p>No hay nodos</p>
              <small>Crea el primer nodo para empezar</small>
            </div>
          ) : (
            <div className="items-grid">
              {nodes.map((node) => (
                <div key={node.id} className="item-card">
                  <div className="item-content">
                    <div className="item-icon">📍</div>
                    <div className="item-info">
                      <span className="item-id">ID: {node.id}</span>
                      <h4 className="item-name">{node.name}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmDelete({ id: node.id, name: node.name })}
                    className="btn-delete"
                    title="Eliminar nodo"
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
          title="Eliminar Nodo"
          message={`¿Estás seguro de eliminar el nodo "${confirmDelete.name}"? Se borrarán también sus aristas.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
}

export default Nodes;