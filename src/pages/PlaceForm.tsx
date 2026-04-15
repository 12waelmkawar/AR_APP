import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addPlace, updatePlace, getPlaces } from '../firebase/placesService';
import './PlaceForm.css';

const BUILDINGS = ['Bloc Blue', 'Bloc Vert', 'Administration'];
const CATEGORIES = ['classroom', 'lab', 'office', 'restroom', 'cafeteria', 'library', 'other'];
const DATASETS = [
  'blocBlue-etage0-p1',
  'blocBlue-etage0-p2',
  'blocVert-etage0-p1',
  'administrationrdc1',
  'administrationrdc2'
];

const PlaceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    floor: 0,
    building: BUILDINGS[0],
    category: CATEGORIES[0],
    description: '',
    capacity: 30,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    vuforiaDataset: DATASETS[0],
    amenities: [] as string[],
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

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
              floor: place.floor,
              building: place.building,
              category: place.category,
              description: place.description || '',
              capacity: place.capacity || 30,
              positionX: place.position.x,
              positionY: place.position.y,
              positionZ: place.position.z,
              vuforiaDataset: place.vuforiaDataset || DATASETS[0],
              amenities: place.amenities || [],
              isActive: place.isActive
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
        floor: formData.floor,
        building: formData.building,
        category: formData.category,
        description: formData.description,
        capacity: formData.capacity,
        position: {
          x: formData.positionX,
          y: formData.positionY,
          z: formData.positionZ
        },
        vuforiaDataset: formData.vuforiaDataset,
        amenities: formData.amenities,
        isActive: formData.isActive
      };

      if (isEditing && id) {
        await updatePlace(id, placeData);
      } else {
        await addPlace(placeData);
      }

      navigate('/places');
    } catch (error) {
      console.error('Error saving place:', error);
      alert('Error saving place. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (fetching) {
    return <div className="form-loading">Loading place details...</div>;
  }

  return (
    <div className="place-form-page">
      <div className="form-header">
        <h1>{isEditing ? 'Edit Place' : 'Add New Place'}</h1>
        <button className="btn-cancel" onClick={() => navigate('/places')}>
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="place-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label>Name (ID)*</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., room_a101"
              required
            />
          </div>

          <div className="form-group">
            <label>Display Name*</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={e => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="e.g., Computer Science Lab"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Building*</label>
              <select
                value={formData.building}
                onChange={e => setFormData({ ...formData, building: e.target.value })}
                required
              >
                {BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Floor*</label>
              <input
                type="number"
                value={formData.floor}
                onChange={e => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category*</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Optional description..."
            />
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

        <div className="form-section">
          <h2>Position (Unity Coordinates)</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>X Position*</label>
              <input
                type="number"
                step="0.01"
                value={formData.positionX}
                onChange={e => setFormData({ ...formData, positionX: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label>Y Position*</label>
              <input
                type="number"
                step="0.01"
                value={formData.positionY}
                onChange={e => setFormData({ ...formData, positionY: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label>Z Position*</label>
              <input
                type="number"
                step="0.01"
                value={formData.positionZ}
                onChange={e => setFormData({ ...formData, positionZ: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>AR Configuration</h2>
          
          <div className="form-group">
            <label>Vuforia Dataset</label>
            <select
              value={formData.vuforiaDataset}
              onChange={e => setFormData({ ...formData, vuforiaDataset: e.target.value })}
            >
              {DATASETS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Amenities</h2>
          
          <div className="amenities-grid">
            {['projector', 'computers', 'ac', 'whiteboard', 'wifi', 'printer', 'tv', 'sound_system'].map(amenity => (
              <label key={amenity} className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                />
                <span>{amenity.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Status</h2>
          
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <span className="slider"></span>
            <span className="toggle-label">Active</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/places')}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Place' : 'Create Place'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceForm;
