import React, { useState } from 'react';
import { initializeDatabase, getSeedStatus, DEFAULT_BUILDINGS, DEFAULT_PLACES } from '../firebase/databaseSeed';
import { exportPlaces, importPlaces, Place } from '../firebase/placesService';
import './DatabaseSettings.css';

const DatabaseSettings: React.FC = () => {
  const [seedStatus, setSeedStatus] = useState(getSeedStatus());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');

  const handleInitialize = async () => {
    if (!window.confirm('This will add sample data to your database. Continue?')) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await initializeDatabase(true);
      setMessage({ type: 'success', text: '✓ Database initialized with sample data!' });
      setSeedStatus(getSeedStatus());
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const places = await exportPlaces();
      const json = JSON.stringify(places, null, 2);
      
      // Download as file
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `places_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: `✓ Exported ${places.length} places successfully!` });
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error exporting: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const places = JSON.parse(importData) as Omit<Place, 'id' | 'createdAt' | 'updatedAt'>[];
      
      if (!Array.isArray(places) || places.length === 0) {
        throw new Error('Invalid data format. Expected an array of places.');
      }

      const ids = await importPlaces(places);
      setMessage({ type: 'success', text: `✓ Imported ${ids.length} places successfully!` });
      setImportData('');
      setShowImport(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error importing: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="database-settings">
      <h1>Database Settings</h1>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-section">
        <h2>Initial Data Setup</h2>
        <p>
          Populate your database with sample buildings and places to get started quickly.
          This includes 3 buildings and 5 sample places.
        </p>
        
        <div className="seed-info">
          <div className="info-item">
            <span className="label">Buildings:</span>
            <span className="value">{DEFAULT_BUILDINGS.length}</span>
          </div>
          <div className="info-item">
            <span className="label">Places:</span>
            <span className="value">{DEFAULT_PLACES.length}</span>
          </div>
          <div className="info-item">
            <span className="label">Database Status:</span>
            <span className={`value ${seedStatus.isSeeded ? 'seeded' : 'not-seeded'}`}>
              {seedStatus.isSeeded ? '✓ Initialized' : '✗ Not initialized'}
            </span>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleInitialize}
          disabled={loading}
        >
          {loading ? 'Initializing...' : 'Initialize Database'}
        </button>
      </div>

      <div className="settings-section">
        <h2>Export & Import</h2>
        <p>Export your places data for backup or import from a previous export.</p>

        <div className="export-import">
          <button 
            className="btn-secondary" 
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? 'Exporting...' : '📥 Export Places'}
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => setShowImport(!showImport)}
          >
            📤 Import Places
          </button>
        </div>

        {showImport && (
          <div className="import-section">
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your exported JSON here..."
              rows={10}
            />
            <div className="import-actions">
              <button 
                className="btn-secondary" 
                onClick={() => { setShowImport(false); setImportData(''); }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleImport}
                disabled={loading || !importData.trim()}
              >
                {loading ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h2>Firebase Configuration</h2>
        <p>
          To update your Firebase configuration, clear the 'firebase_config' key from 
          localStorage and reload the page. The setup wizard will appear again.
        </p>
        <button 
          className="btn-secondary"
          onClick={() => {
            localStorage.removeItem('firebase_config');
            window.location.reload();
          }}
        >
          Reset Firebase Setup
        </button>
      </div>
    </div>
  );
};

export default DatabaseSettings;
