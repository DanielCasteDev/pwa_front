import { useEffect, useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{username: string, name: string, email: string} | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (userData: {username: string, name: string, email: string}) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    try {
      localStorage.setItem('app:user', JSON.stringify(userData));
      localStorage.setItem('app:isLoggedIn', 'true');
    } catch (error) {
      console.warn('No se pudo guardar sesión en localStorage', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    try {
      localStorage.removeItem('app:user');
      localStorage.removeItem('app:isLoggedIn');
    } catch (error) {
      console.warn('No se pudo limpiar sesión de localStorage', error);
    }
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // Restaurar sesión si existe (útil para recargas offline)
    try {
      const storedLoggedIn = localStorage.getItem('app:isLoggedIn') === 'true';
      const storedUser = localStorage.getItem('app:user');
      if (storedLoggedIn && storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.warn('No se pudo restaurar sesión de localStorage', error);
    }
  }, []);

  if (!isLoggedIn || !user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TasksPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
        user={user}
      />
      <div className="lg:ml-64">
        <main className="min-h-screen">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {renderCurrentPage()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;