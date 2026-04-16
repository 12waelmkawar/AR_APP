import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addPlace, updatePlace, getPlaces } from '../firebase/placesService';
import './PlaceForm.css';

const BUILDINGS = ['Bloc Blue', 'Bloc Vert', 'Administration'];
const CATEGORIES = ['classroom', 'lab', 'office', 'restroom', 'cafeteria', 'library', 'other'];

// Minimap icons — emoji + label pairs
const MINIMAP_ICONS = [
  { value: '🏫', label: 'School' },
  { value: '🔬', label: 'Lab' },
  { value: '🏢', label: 'Office' },
  { value: '🚻', label: 'Restroom' },
  { value: '☕', label: 'Cafeteria' },
  { value: '📚', label: 'Library' },
  { value: '🖥️', label: 'Computer' },
  { value: '🎓', label: 'Lecture' },
  { value: '🏥', label: 'Medical' },
  { value: '🅿️', label: 'Parking' },
  { value: '🚪', label: 'Entrance' },
  { value: '📍', label: 'Pin' },
  { value: '⭐', label: 'Star' },
  { value: '🔧', label: 'Technical' },
  { value: '🎨', label: 'Art' },
  { value: '🏃', label: 'Sports' },
];

const PlaceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    building: BUILDINGS[0],
    category: CATEGORIES[0],
    capacity: 30,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    minimapIcon: '📍',
    minimapColor: '#667eea',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const fetchPlace = async () => {
        setFetching(true);
        try {
          const places = await getPlaces();
          const place = places.find(p => p.id === id);
          if (place) {
            setFormData({
              name: place.name,
              displayName: place.displayName,
              building: place.building,
              category: place.category,
              capacity: place.capacity || 30,
              positionX: place.position.x,
              positionY: place.position.y,
              positionZ: place.position.z,
              minimapIcon: place.minimapIcon || '📍',
              minimapColor: place.minimapColor || '#667eea',
              isActive: place.isActive,
            });
          }
        } catch (error) {
          console.error('Error fetching place:', error);
        } finally {
          setFetching(false);
        }
      };
      fetchPlace();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const placeData = {
        name: formData.name,
        displayName: formData.displayName,
        floor: 0,
        building: formData.building,
        category: formData.category,
        description: '',
        capacity: formData.capacity,
        // Force values to double (not int64) in Firestore
        position: {
          x: Number(formData.positionX.toFixed(6)),
          y: Number(formData.positionY.toFixed(6)),
          z: Number(formData.positionZ.toFixed(6)),
        },
        vuforiaDataset: '',
        amenities: [],
        minimapIcon: formData.minimapIcon,
        minimapColor: formData.minimapColor,
        isActive: formData.isActive,
      };

      if (isEditing && id) {
        await updatePlace(id, placeData);
      } else {
        await addPlace(placeData);
      }

      setSaveSuccess(true);
      setTimeout(() => navigate('/places'), 1200);
    } catch (error) {
      console.error('Error saving place:', error);
      alert('Error saving place. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="form-loading">
        <div className="loading-spinner" />
        <span>Loading place details...</span>
      </div>
    );
  }

  return (
    <div className="place-form-page">
      {/* Header */}
      <div className="form-header">
        <div className="form-header-left">
          <button className="btn-back" onClick={() => navigate('/places')}>
            ←
          </button>
          <div>
            <h1>{isEditing ? 'Edit Place' : 'New Place'}</h1>
            <p className="form-subtitle">{isEditing ? 'Update place details' : 'Add a location to the AR map'}</p>
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

      <form onSubmit={handleSubmit} className="place-form">

        {/* Basic Info */}
        <div className="form-card">
          <div className="form-card-header">
            <span className="card-icon">📝</span>
            <h2>Basic Information</h2>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Internal ID *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., room_a101"
                required
              />
              <span className="field-hint">Used as document ID in Firestore</span>
            </div>
            <div className="form-group">
              <label>Display Name *</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="e.g., Computer Science Lab"
                required
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Building *</label>
              <select
                value={formData.building}
                onChange={e => setFormData({ ...formData, building: e.target.value })}
                required
              >
                {BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                min={1}
              />
            </div>
          </div>
        </div>

        {/* Position */}
        <div className="form-card">
          <div className="form-card-header">
            <span className="card-icon">📐</span>
            <h2>Unity Position</h2>
          </div>
          <p className="card-desc">3D coordinates from the Unity scene (Inspector → Transform → Position)</p>

          <div className="form-row-3">
            <div className="form-group">
              <label>X</label>
              <div className="axis-input x-axis">
                <span className="axis-label">X</span>
                <input
                  type="number"
                  step="0.001"
                  value={formData.positionX}
                  onChange={e => setFormData({ ...formData, positionX: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Y</label>
              <div className="axis-input y-axis">
                <span className="axis-label">Y</span>
                <input
                  type="number"
                  step="0.001"
                  value={formData.positionY}
                  onChange={e => setFormData({ ...formData, positionY: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Z</label>
              <div className="axis-input z-axis">
                <span className="axis-label">Z</span>
                <input
                  type="number"
                  step="0.001"
                  value={formData.positionZ}
                  onChange={e => setFormData({ ...formData, positionZ: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Minimap */}
        <div className="form-card">
          <div className="form-card-header">
            <span className="card-icon">🗺️</span>
            <h2>Minimap Appearance</h2>
          </div>

          <div className="minimap-preview">
            <div
              className="minimap-marker-preview"
              style={{ background: formData.minimapColor }}
            >
              {formData.minimapIcon}
            </div>
            <div className="minimap-preview-info">
              <strong>{formData.displayName || 'Place Name'}</strong>
              <span>{formData.category}</span>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Marker Color</label>
              <div className="color-input-wrap">
                <input
                  type="color"
                  value={formData.minimapColor}
                  onChange={e => setFormData({ ...formData, minimapColor: e.target.value })}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={formData.minimapColor}
                  onChange={e => setFormData({ ...formData, minimapColor: e.target.value })}
                  placeholder="#667eea"
                  className="color-text"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Selected Icon</label>
              <div className="selected-icon-display">
                <span className="selected-icon-emoji">{formData.minimapIcon}</span>
                <span className="selected-icon-name">
                  {MINIMAP_ICONS.find(i => i.value === formData.minimapIcon)?.label || 'Custom'}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Minimap Icon</label>
            <div className="icon-grid">
              {MINIMAP_ICONS.map(icon => (
                <button
                  key={icon.value}
                  type="button"
                  className={`icon-btn ${formData.minimapIcon === icon.value ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, minimapIcon: icon.value })}
                  title={icon.label}
                  style={formData.minimapIcon === icon.value ? { borderColor: formData.minimapColor, background: formData.minimapColor + '22' } : {}}
                >
                  <span className="icon-emoji">{icon.value}</span>
                  <span className="icon-label">{icon.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/places')}>
            Cancel
          </button>
          <button type="submit" className={`btn-submit ${saveSuccess ? 'success' : ''}`} disabled={loading || saveSuccess}>
            {saveSuccess ? '✓ Saved!' : loading ? 'Saving...' : isEditing ? 'Update Place' : 'Create Place'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceForm;
