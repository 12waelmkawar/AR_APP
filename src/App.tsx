import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PinAuth from './components/PinAuth';
import Layout from './components/Layout';
import ConnectionStatus from './components/ConnectionStatus';
import FirebaseSetupWizard from './components/FirebaseSetupWizard';
import Dashboard from './pages/Dashboard';
import Places from './pages/Places';
import PlaceForm from './pages/PlaceForm';
import DatabaseSettings from './pages/DatabaseSettings';
import { isAuthenticated } from './firebase/authService';
import './App.css';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  useEffect(() => {
    setChecking(true);
    
    // Check if Firebase is configured
    const firebaseConfig = localStorage.getItem('firebase_config');
    if (!firebaseConfig) {
      setShowSetupWizard(true);
    }
    
    const auth = isAuthenticated();
    setAuthenticated(auth);
    setChecking(false);
  }, []);

  const handleAuthenticate = () => {
    setAuthenticated(true);
  };

  const handleSetupComplete = () => {
    setShowSetupWizard(false);
    // Reload to apply Firebase config
    window.location.reload();
  };

  if (checking) {
    return <div className="app-loading">Loading...</div>;
  }

  if (showSetupWizard) {
    return <FirebaseSetupWizard onComplete={handleSetupComplete} />;
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
