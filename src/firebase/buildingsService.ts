import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

export interface Building {
  id?: string;
  name: string;
  code: string;
  description?: string;
  floors: number[];
  isActive: boolean;
  minimapImage?: string;
  bounds?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const BUILDINGS_COLLECTION = 'buildings';

// Get all buildings
export const getBuildings = async (): Promise<Building[]> => {
  try {
    const q = query(collection(db, BUILDINGS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Building[];
  } catch (error) {
    console.error('Error getting buildings:', error);
    throw error;
  }
};

// Get active buildings
export const getActiveBuildings = async (): Promise<Building[]> => {
  try {
    const q = query(
      collection(db, BUILDINGS_COLLECTION), 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Building[];
  } catch (error) {
    console.error('Error getting active buildings:', error);
    throw error;
  }
};

// Get single building by ID
export const getBuildingById = async (id: string): Promise<Building | null> => {
  try {
    const docRef = doc(db, BUILDINGS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Building;
    }
    return null;
  } catch (error) {
    console.error('Error getting building by ID:', error);
    throw error;
  }
};

// Add new building
export const addBuilding = async (building: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, BUILDINGS_COLLECTION), {
      ...building,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding building:', error);
    throw error;
  }
};

// Update existing building
export const updateBuilding = async (id: string, building: Partial<Building>): Promise<void> => {
  try {
    const docRef = doc(db, BUILDINGS_COLLECTION, id);
    await updateDoc(docRef, {
      ...building,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating building:', error);
    throw error;
  }
};

// Delete building
export const deleteBuilding = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, BUILDINGS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting building:', error);
    throw error;
  }
};

// Toggle building active status
export const toggleBuildingStatus = async (id: string, isActive: boolean): Promise<void> => {
  try {
    const docRef = doc(db, BUILDINGS_COLLECTION, id);
    await updateDoc(docRef, {
      isActive,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling building status:', error);
    throw error;
  }
};

// Get building by code
export const getBuildingByCode = async (code: string): Promise<Building | null> => {
  try {
    const q = query(
      collection(db, BUILDINGS_COLLECTION), 
      where('code', '==', code)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Building;
    }
    return null;
  } catch (error) {
    console.error('Error getting building by code:', error);
    throw error;
  }
};
