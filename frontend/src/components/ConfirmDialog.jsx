import './ConfirmDialog.css';

function ConfirmDialog({ message, onConfirm, onCancel, title = '¿Estás seguro?' }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="confirm-header">
          <span className="confirm-icon">⚠️</span>
          <h3>{title}</h3>
        </div>
        
        <div className="confirm-body">
          <p>{message}</p>
        </div>
        
        <div className="confirm-actions">
          <button onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;