import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import './ConnectionStatus.css';

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create a connection status document
    const connectionRef = doc(db, '.info', 'connected');
    
    // Listen to connection status changes
    const unsubscribe = onSnapshot(connectionRef, 
      (docSnapshot) => {
        setIsConnected(docSnapshot.exists());
        setIsLoading(false);
      },
      (error) => {
        // If we can't connect to .info, assume we're offline
        console.warn('Connection check failed:', error);
        setIsConnected(false);
        setIsLoading(false);
      }
    );

    // Simpler connection check using navigator.onLine
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsConnected(navigator.onLine);
    setIsLoading(false);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className={`connection-status ${isConnected ? 'online' : 'offline'}`}>
      <span className="status-dot"></span>
      <span className="status-text">
        {isConnected ? 'Connected' : 'Offline'}
      </span>
    </div>
  );
};

export default ConnectionStatus;
