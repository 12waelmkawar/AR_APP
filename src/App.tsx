import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PinAuth from './components/PinAuth';
import Layout from './components/Layout';
import ConnectionStatus from './components/ConnectionStatus';
import Dashboard from './pages/Dashboard';
import Places from './pages/Places';
import PlaceForm from './pages/PlaceForm';
import DatabaseSettings from './pages/DatabaseSettings';
import { isAuthenticated } from './firebase/authService';
import './App.css';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setChecking(true);
    const auth = isAuthenticated();
    setAuthenticated(auth);
    setChecking(false);
  }, []);

  const handleAuthenticate = () => {
    setAuthenticated(true);
  };

  if (checking) {
    return <div className="app-loading">Loading...</div>;
  }

  if (!authenticated) {
    return <PinAuth onAuthenticate={handleAuthenticate} />;
  }

  return (
    <Router>
      <ConnectionStatus />
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/new" element={<PlaceForm />} />
          <Route path="/places/edit/:id" element={<PlaceForm />} />
          <Route path="/database-settings" element={<DatabaseSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
