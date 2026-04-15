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
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';

export interface Place {
  id?: string;
  name: string;
  displayName: string;
  floor: number;
  building: string;
  category: string;
  description?: string;
  capacity?: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  vuforiaDataset?: string;
  amenities?: string[];
  minimapIcon?: string;
  minimapColor?: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const PLACES_COLLECTION = 'places';

// Get all places with real-time updates
export const getPlaces = async (): Promise<Place[]> => {
  try {
    const q = query(collection(db, PLACES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Place[];
  } catch (error) {
    console.error('Error getting places:', error);
    throw error;
  }
};

// Get places by building
export const getPlacesByBuilding = async (building: string): Promise<Place[]> => {
  try {
    const q = query(
      collection(db, PLACES_COLLECTION), 
      where('building', '==', building),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Place[];
  } catch (error) {
    console.error('Error getting places by building:', error);
    throw error;
  }
};

// Get active places only
export const getActivePlaces = async (): Promise<Place[]> => {
  try {
    const q = query(
      collection(db, PLACES_COLLECTION), 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Place[];
  } catch (error) {
    console.error('Error getting active places:', error);
    throw error;
  }
};

// Get single place by ID
export const getPlaceById = async (id: string): Promise<Place | null> => {
  try {
    const docRef = doc(db, PLACES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Place;
    }
    return null;
  } catch (error) {
    console.error('Error getting place by ID:', error);
    throw error;
  }
};

// Add new place
export const addPlace = async (place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PLACES_COLLECTION), {
      ...place,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding place:', error);
    throw error;
  }
};

// Update existing place
export const updatePlace = async (id: string, place: Partial<Place>): Promise<void> => {
  try {
    const docRef = doc(db, PLACES_COLLECTION, id);
    await updateDoc(docRef, {
      ...place,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating place:', error);
    throw error;
  }
};

// Delete place
export const deletePlace = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, PLACES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
};

// Toggle place active status
export const togglePlaceStatus = async (id: string, isActive: boolean): Promise<void> => {
  try {
    const docRef = doc(db, PLACES_COLLECTION, id);
    await updateDoc(docRef, {
      isActive,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling place status:', error);
    throw error;
  }
};

// Subscribe to real-time updates
export const subscribeToPlaces = (callback: (places: Place[]) => void) => {
  const q = query(collection(db, PLACES_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const places = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Place[];
    callback(places);
  }, (error) => {
    console.error('Error subscribing to places:', error);
  });
};

// Get places count
export const getPlacesCount = async (): Promise<number> => {
  try {
    const q = query(collection(db, PLACES_COLLECTION));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting places count:', error);
    throw error;
  }
};

// Get active places count
export const getActivePlacesCount = async (): Promise<number> => {
  try {
    const q = query(collection(db, PLACES_COLLECTION), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting active places count:', error);
    throw error;
  }
};

// Get unique buildings
export const getUniqueBuildings = async (): Promise<string[]> => {
  try {
    const places = await getPlaces();
    const buildings = [...new Set(places.map(p => p.building))];
    return buildings.sort();
  } catch (error) {
    console.error('Error getting unique buildings:', error);
    throw error;
  }
};

// Get places by floor
export const getPlacesByFloor = async (building: string, floor: number): Promise<Place[]> => {
  try {
    const q = query(
      collection(db, PLACES_COLLECTION), 
      where('building', '==', building),
      where('floor', '==', floor),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Place[];
  } catch (error) {
    console.error('Error getting places by floor:', error);
    throw error;
  }
};

// Batch delete places
export const batchDeletePlaces = async (ids: string[]): Promise<void> => {
  try {
    const promises = ids.map(id => deletePlace(id));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error batch deleting places:', error);
    throw error;
  }
};

// Export places as JSON
export const exportPlaces = async (): Promise<Place[]> => {
  try {
    return await getPlaces();
  } catch (error) {
    console.error('Error exporting places:', error);
    throw error;
  }
};

// Import places from JSON
export const importPlaces = async (places: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> => {
  try {
    const promises = places.map(place => addPlace(place));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error importing places:', error);
    throw error;
  }
};
