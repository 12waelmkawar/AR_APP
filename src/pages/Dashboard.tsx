import React, { useEffect, useState } from 'react';
import { getPlaces } from '../firebase/placesService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [totalPlaces, setTotalPlaces] = useState(0);
  const [activePlaces, setActivePlaces] = useState(0);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const places = await getPlaces();
        setTotalPlaces(places.length);
        setActivePlaces(places.filter(p => p.isActive).length);
        
        const uniqueBuildings = [...new Set(places.map(p => p.building))];
        setBuildings(uniqueBuildings);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-value">{totalPlaces}</div>
          <div className="stat-label">Total Places</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{activePlaces}</div>
          <div className="stat-label">Active Places</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">{buildings.length}</div>
          <div className="stat-label">Buildings</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏸️</div>
          <div className="stat-value">{totalPlaces - activePlaces}</div>
          <div className="stat-label">Inactive Places</div>
        </div>
      </div>

      {buildings.length > 0 && (
        <div className="buildings-section">
          <h2>Buildings</h2>
          <div className="buildings-list">
            {buildings.map((building, idx) => (
              <div key={idx} className="building-item">
                {building}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
