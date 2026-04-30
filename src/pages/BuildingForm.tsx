import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addBuilding, Building, getBuildingById, updateBuilding } from '../firebase/buildingsService';
import './BuildingForm.css';

const BuildingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isEditing || !id) return;

    const fetchBuilding = async () => {
      setFetching(true);
      try {
        const building = await getBuildingById(id);
        if (building) {
          setFormData({
            name: building.name,
            code: building.code,
            description: building.description || '',
            isActive: building.isActive,
          });
        }
      } catch (error) {
        console.error('Error fetching building:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchBuilding();
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        floors: [0],
        isActive: formData.isActive,
      };

      if (isEditing && id) {
        await updateBuilding(id, buildingData);
      } else {
        await addBuilding(buildingData);
      }

      setSaveSuccess(true);
      setTimeout(() => navigate('/buildings'), 1200);
    } catch (error) {
      console.error('Error saving building:', error);
      alert('Error saving building. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="form-loading">
        <div className="loading-spinner" />
        <span>Loading building details...</span>
      </div>
    );
  }

  return (
    <div className="building-form-page">
      <div className="form-header">
        <div className="form-header-left">
          <button className="btn-back" onClick={() => navigate('/buildings')}>
            ←
          </button>
          <div>
            <h1>{isEditing ? 'Edit Building' : 'New Building'}</h1>
            <p className="form-subtitle">{isEditing ? 'Update building details' : 'Add a building to manage places'}</p>
          </div>
        </div>
        <div className="status-toggle-inline">
          <span className={`status-badge ${formData.isActive ? 'active' : 'inactive'}`}>
            {formData.isActive ? '● Active' : '○ Inactive'}
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <span className="slider" />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="building-form">
        <div className="form-card">
          <div className="form-card-header">
            <span className="card-icon">🏢</span>
            <h2>Building Information</h2>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Bloc Blue"
                required
              />
            </div>
            <div className="form-group">
              <label>Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., bloc_blue"
                required
              />
              <span className="field-hint">Used for internal references and datasets</span>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description for this building"
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/buildings')}>
            Cancel
          </button>
          <button type="submit" className={`btn-submit ${saveSuccess ? 'success' : ''}`} disabled={loading || saveSuccess}>
            {saveSuccess ? '✓ Saved!' : loading ? 'Saving...' : isEditing ? 'Update Building' : 'Create Building'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuildingForm;
