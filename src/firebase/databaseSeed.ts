import { addBuilding, Building } from './buildingsService';
import { addPlace, Place } from './placesService';

// Default data for initial database setup
export const DEFAULT_BUILDINGS: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Bloc Blue',
    code: 'bloc_blue',
    description: 'Main academic building with classrooms and labs',
    floors: [-1, 0, 1, 2],
    isActive: true,
    bounds: {
      minX: -20,
      maxX: 50,
      minZ: -30,
      maxZ: 40
    }
  },
  {
    name: 'Bloc Vert',
    code: 'bloc_vert',
    description: 'Secondary building with offices and study rooms',
    floors: [0, 1],
    isActive: true,
    bounds: {
      minX: -15,
      maxX: 45,
      minZ: -25,
      maxZ: 35
    }
  },
  {
    name: 'Administration',
    code: 'administration',
    description: 'Administrative offices and meeting rooms',
    floors: [0, 1],
    isActive: true,
    bounds: {
      minX: -10,
      maxX: 30,
      minZ: -20,
      maxZ: 25
    }
  }
];

export const DEFAULT_PLACES: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'room_a101',
    displayName: 'Computer Science Lab',
    floor: 0,
    building: 'Bloc Blue',
    category: 'lab',
    description: 'Main computer lab with 30 workstations',
    capacity: 30,
    position: { x: 12.5, y: 0, z: -8.3 },
    vuforiaDataset: 'blocBlue-etage0-p1',
    amenities: ['projector', 'computers', 'ac', 'wifi'],
    minimapIcon: 'computer',
    minimapColor: '#4A90E2',
    isActive: true
  },
  {
    name: 'room_a102',
    displayName: 'Lecture Hall A',
    floor: 0,
    building: 'Bloc Blue',
    category: 'classroom',
    description: 'Large lecture hall for introductory courses',
    capacity: 120,
    position: { x: 18.2, y: 0, z: -5.1 },
    vuforiaDataset: 'blocBlue-etage0-p1',
    amenities: ['projector', 'ac', 'sound_system'],
    minimapIcon: 'classroom',
    minimapColor: '#50C878',
    isActive: true
  },
  {
    name: 'room_b201',
    displayName: 'Mathematics Office',
    floor: 1,
    building: 'Bloc Blue',
    category: 'office',
    description: 'Mathematics department faculty office',
    capacity: 8,
    position: { x: 25.0, y: 4.5, z: -12.7 },
    vuforiaDataset: 'blocBlue-etage0-p2',
    amenities: ['ac', 'wifi'],
    minimapIcon: 'office',
    minimapColor: '#FFA500',
    isActive: true
  },
  {
    name: 'restroom_g0',
    displayName: 'Restroom - Ground Floor',
    floor: 0,
    building: 'Bloc Blue',
    category: 'restroom',
    description: 'Public restrooms',
    position: { x: 5.0, y: 0, z: -15.0 },
    vuforiaDataset: 'blocBlue-etage0-p1',
    amenities: [],
    minimapIcon: 'restroom',
    minimapColor: '#9B59B6',
    isActive: true
  },
  {
    name: 'cafeteria_main',
    displayName: 'Main Cafeteria',
    floor: 0,
    building: 'Bloc Vert',
    category: 'cafeteria',
    description: 'Student cafeteria and dining area',
    capacity: 80,
    position: { x: 10.0, y: 0, z: 5.0 },
    vuforiaDataset: 'blocVert-etage0-p1',
    amenities: ['ac', 'wifi'],
    minimapIcon: 'cafeteria',
    minimapColor: '#E74C3C',
    isActive: true
  }
];

// Database seed status
let isSeeded = false;

// Check if database has been seeded
export const checkIfSeeded = (): boolean => {
  const seeded = localStorage.getItem('db_seeded');
  return seeded === 'true' || isSeeded;
};

// Mark database as seeded
export const markAsSeeded = (): void => {
  localStorage.setItem('db_seeded', 'true');
  isSeeded = true;
};

// Initialize database with default data
export const initializeDatabase = async (force: boolean = false): Promise<boolean> => {
  if (checkIfSeeded() && !force) {
    console.log('Database already initialized. Use force=true to reinitialize.');
    return false;
  }

  try {
    console.log('Initializing database with default data...');
    
    // Add buildings
    console.log('Adding buildings...');
    for (const building of DEFAULT_BUILDINGS) {
      await addBuilding(building);
    }
    console.log(`✓ Added ${DEFAULT_BUILDINGS.length} buildings`);

    // Add places
    console.log('Adding places...');
    for (const place of DEFAULT_PLACES) {
      await addPlace(place);
    }
    console.log(`✓ Added ${DEFAULT_PLACES.length} places`);

    // Mark as seeded
    markAsSeeded();
    console.log('✓ Database initialization complete');
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get seed status
export const getSeedStatus = (): {
  isSeeded: boolean;
  buildingsCount: number;
  placesCount: number;
} => {
  return {
    isSeeded: checkIfSeeded(),
    buildingsCount: DEFAULT_BUILDINGS.length,
    placesCount: DEFAULT_PLACES.length
  };
};
