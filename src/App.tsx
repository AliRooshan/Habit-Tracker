import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brown-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brown-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Landing onLogin={handleLogin} />
      )}
    </ThemeProvider>
  );
}

export default App;
