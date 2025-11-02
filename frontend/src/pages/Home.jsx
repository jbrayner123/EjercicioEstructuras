import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../api';
import Nodes from '../components/Nodes';
import Edges from '../components/Edges';
import Algorithms from '../components/Algorithms';
import './Home.css';

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <div className="loading">Cargando</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🗺️ PathFinder</h1>
        <div className="user-info">
          <span>Hola, {user.username}!</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="home-main">
        <h2>Gestor de Grafos</h2>
        <p>Gestiona nodos, aristas y ejecuta algoritmos de búsqueda</p>
        
        <Nodes />
        <Edges />
        <Algorithms />
      </main>
    </div>
  );
}

export default Home;