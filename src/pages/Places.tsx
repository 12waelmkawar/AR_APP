import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Place, getPlaces, deletePlace } from '../firebase/placesService';
import './Places.css';

const Places: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const data = await getPlaces();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await deletePlace(id);
        fetchPlaces();
      } catch (error) {
        console.error('Error deleting place:', error);
      }
    }
  };

  const filteredPlaces = places.filter(place => {
    if (filter === 'all') return true;
    if (filter === 'active') return place.isActive;
    if (filter === 'inactive') return !place.isActive;
    return true;
  });

  if (loading) {
    return <div className="places-loading">Loading places...</div>;
  }

  return (
    <div className="places-page">
      <div className="page-header">
        <h1>Places</h1>
        <Link to="/places/new" className="btn-primary">
          Add Place
        </Link>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({places.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({places.filter(p => p.isActive).length})
        </button>
        <button
          className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
          onClick={() => setFilter('inactive')}
        >
          Inactive ({places.filter(p => !p.isActive).length})
        </button>
      </div>

      <div className="places-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Display Name</th>
              <th>Building</th>
              <th>Floor</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaces.map(place => (
              <tr key={place.id}>
                <td>{place.name}</td>
                <td>{place.displayName}</td>
                <td>{place.building}</td>
                <td>{place.floor}</td>
                <td>{place.category}</td>
                <td>
                  <span className={`status-badge ${place.isActive ? 'active' : 'inactive'}`}>
                    {place.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <Link to={`/places/edit/${place.id}`} className="btn-small">
                    Edit
                  </Link>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(place.id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPlaces.length === 0 && (
          <div className="empty-state">
            <p>No places found</p>
            <Link to="/places/new" className="btn-primary">
              Add your first place
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Places;
