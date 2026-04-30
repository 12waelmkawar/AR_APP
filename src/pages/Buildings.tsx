import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, deleteBuilding, getBuildings, toggleBuildingStatus } from '../firebase/buildingsService';
import './Buildings.css';

const Buildings: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const data = await getBuildings();
      setBuildings(data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this building?')) {
      try {
        await deleteBuilding(id);
        fetchBuildings();
      } catch (error) {
        console.error('Error deleting building:', error);
      }
    }
  };

  const handleToggle = async (building: Building) => {
    if (!building.id) return;
    try {
      await toggleBuildingStatus(building.id, !building.isActive);
      fetchBuildings();
    } catch (error) {
      console.error('Error toggling building status:', error);
    }
  };

  const filteredBuildings = buildings.filter(building => {
    if (filter === 'all') return true;
    if (filter === 'active') return building.isActive;
    if (filter === 'inactive') return !building.isActive;
    return true;
  });

  if (loading) {
    return <div className="buildings-loading">Loading buildings...</div>;
  }

  return (
    <div className="buildings-page">
      <div className="page-header">
        <h1>Buildings</h1>
        <Link to="/buildings/new" className="btn-primary">
          Add Building
        </Link>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({buildings.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({buildings.filter(b => b.isActive).length})
        </button>
        <button
          className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
          onClick={() => setFilter('inactive')}
        >
          Inactive ({buildings.filter(b => !b.isActive).length})
        </button>
      </div>

      <div className="buildings-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Floors</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuildings.map(building => (
              <tr key={building.id}>
                <td>{building.name}</td>
                <td>{building.code}</td>
                <td>{building.floors?.join(', ') || '-'}</td>
                <td>
                  <span className={`status-badge ${building.isActive ? 'active' : 'inactive'}`}>
                    {building.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <Link to={`/buildings/edit/${building.id}`} className="btn-small">
                    Edit
                  </Link>
                  <button
                    className="btn-small"
                    onClick={() => handleToggle(building)}
                  >
                    {building.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(building.id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBuildings.length === 0 && (
          <div className="empty-state">
            <p>No buildings found</p>
            <Link to="/buildings/new" className="btn-primary">
              Add your first building
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buildings;
