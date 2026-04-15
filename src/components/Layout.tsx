import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../firebase/authService';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🎯 AR Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            📊 Dashboard
          </Link>
          <Link 
            to="/places" 
            className={`nav-link ${location.pathname === '/places' ? 'active' : ''}`}
          >
            📍 Places
          </Link>
          <Link 
            to="/places/new" 
            className={`nav-link ${location.pathname === '/places/new' ? 'active' : ''}`}
          >
            ➕ Add Place
          </Link>
          <Link 
            to="/database-settings" 
            className={`nav-link ${location.pathname === '/database-settings' ? 'active' : ''}`}
          >
            ⚙️ Database
          </Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
