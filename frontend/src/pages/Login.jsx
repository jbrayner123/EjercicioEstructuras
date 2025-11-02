import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { toasts, removeToast, success, error: showError, info } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        info('Iniciando sesión...');
        const response = await login(username, password);
        localStorage.setItem('token', response.access_token);
        success(`¡Bienvenido de nuevo, ${username}!`);
        
        // Esperar un momento para que se vea la notificación
        setTimeout(() => {
          navigate('/home');
        }, 500);
      } else {
        // Registro
        info('Creando cuenta...');
        await register(username, password);
        success(`¡Cuenta creada exitosamente! Ahora puedes iniciar sesión, ${username}`);
        
        // Cambiar a modo login después de 1.5 segundos
        setTimeout(() => {
          setIsLogin(true);
          setPassword(''); // Limpiar contraseña
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 
                       (isLogin ? 'Error al iniciar sesión' : 'Error al crear cuenta');
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h1>🗺️ PathFinder</h1>
          <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Usuario:</label>
              <input
                type="text"
                id="username"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading 
                ? (isLogin ? '⏳ Ingresando...' : '⏳ Creando cuenta...') 
                : (isLogin ? 'INGRESAR' : 'REGISTRARSE')
              }
            </button>
          </form>

          <div className="toggle-mode">
            <span>{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</span>
            <button type="button" onClick={toggleMode} className="btn-link">
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
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

export default Login;