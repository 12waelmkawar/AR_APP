# Firebase Database Setup Guide

## ✅ What's Been Added

Your admin web app now has **complete Firebase Firestore integration**!

### 🎯 Features Added:

1. **Firebase Setup Wizard** - Guided 3-step setup process
2. **Connection Status Indicator** - Shows online/offline status
3. **Places CRUD Operations** - Full database operations with error handling
4. **Buildings Management** - Separate collection for building data
5. **Database Initialization** - Seed with sample data (3 buildings, 5 places)
6. **Export/Import** - Backup and restore places data as JSON
7. **Offline Persistence** - Works offline with local caching
8. **Real-time Updates** - Subscribe to database changes

---

## 🚀 Quick Start - First Time Setup

### Step 1: Run the App
```bash
npm run dev
```

### Step 2: Firebase Setup Wizard
When you first open the app, you'll see a **3-step wizard**:

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Name it (e.g., "ar-navigation-admin")
   - Create project

2. **Enable Firestore Database**
   - Click "Firestore Database" in sidebar
   - Click "Create database"
   - Select "Start in test mode"
   - Choose location close to you
   - Click "Enable"

3. **Get Firebase Config**
   - Click ⚙️ (Project Settings)
   - Click web icon `</>` to register web app
   - Copy the `firebaseConfig` object
   - Paste each field into the wizard form
   - Click "Save & Continue"

### Step 3: Initialize Database
After setup:
1. Enter PIN: `1234`
2. Go to **⚙️ Database** in sidebar
3. Click **"Initialize Database"**
4. This adds sample data:
   - 3 buildings (Bloc Blue, Bloc Vert, Administration)
   - 5 sample places (labs, classrooms, offices, etc.)

---

## 📁 Firebase Service Files

### `src/firebase/config.ts`
- Initializes Firebase app
- Loads config from localStorage (saved by wizard)
- Enables offline persistence
- Exports `db` and `auth` instances

### `src/firebase/placesService.ts`
Complete places CRUD operations:
```typescript
getPlaces()              // Get all places
getActivePlaces()        // Get only active places
getPlaceById(id)         // Get single place
addPlace(place)          // Add new place
updatePlace(id, data)    // Update place
deletePlace(id)          // Delete place
togglePlaceStatus(id)    // Toggle active/inactive
subscribeToPlaces(cb)    // Real-time updates
getPlacesByBuilding()    // Filter by building
getPlacesByFloor()       // Filter by building + floor
exportPlaces()           // Export as JSON
importPlaces(data)       // Import from JSON
```

### `src/firebase/buildingsService.ts`
Building management:
```typescript
getBuildings()           // Get all buildings
getActiveBuildings()     // Get active buildings
getBuildingById(id)      // Get single building
addBuilding(building)    // Add new building
updateBuilding(id, data) // Update building
deleteBuilding(id)       // Delete building
getBuildingByCode(code)  // Get by unique code
```

### `src/firebase/databaseSeed.ts`
Sample data and initialization:
```typescript
initializeDatabase()     // Seed with sample data
checkIfSeeded()          // Check if already seeded
DEFAULT_BUILDINGS        // Sample buildings array
DEFAULT_PLACES          // Sample places array
```

---

## 🗄️ Database Structure

### Collection: `places`
```json
{
  "name": "room_a101",
  "displayName": "Computer Science Lab",
  "floor": 0,
  "building": "Bloc Blue",
  "category": "lab",
  "description": "Main computer lab with 30 workstations",
  "capacity": 30,
  "position": { "x": 12.5, "y": 0, "z": -8.3 },
  "vuforiaDataset": "blocBlue-etage0-p1",
  "amenities": ["projector", "computers", "ac", "wifi"],
  "minimapIcon": "computer",
  "minimapColor": "#4A90E2",
  "isActive": true,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Collection: `buildings`
```json
{
  "name": "Bloc Blue",
  "code": "bloc_blue",
  "description": "Main academic building with classrooms and labs",
  "floors": [-1, 0, 1, 2],
  "isActive": true,
  "minimapImage": "bloc_blue_floor_0.png",
  "bounds": {
    "minX": -20,
    "maxX": 50,
    "minZ": -30,
    "maxZ": 40
  },
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

## 🔧 Database Settings Page

Access via sidebar: **⚙️ Database**

### Features:
1. **Initialize Database**
   - Adds sample buildings and places
   - Shows current seed status
   - Can force re-initialization

2. **Export Places**
   - Downloads all places as JSON file
   - Includes all fields and metadata
   - Filename includes date

3. **Import Places**
   - Paste exported JSON
   - Validates format before import
   - Adds all places to database

4. **Reset Firebase Setup**
   - Clears stored Firebase config
   - Shows setup wizard again
   - Useful for switching projects

---

## 🔒 Firestore Security Rules

For production, set these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Places collection
    match /places/{placeId} {
      allow read: if true;  // Anyone can read
      allow write: if request.auth != null;  // Only authenticated users
    }
    
    // Buildings collection
    match /buildings/{buildingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📊 Using the Database

### Adding Places via Admin Panel
1. Go to **➕ Add Place**
2. Fill in the form:
   - Name (unique ID)
   - Display Name (shown to users)
   - Building & Floor
   - Category (classroom, lab, office, etc.)
   - Position (X, Y, Z from Unity)
   - Minimap icon & color
   - Active status
3. Click "Create Place"
4. ✅ Instantly saved to Firestore

### Managing Buildings
Currently buildings are initialized via seed data. To add manually:
1. Go to **⚙️ Database**
2. Use Firebase Console to add buildings
3. Or use the Firestore API directly

### Real-time Updates
The app can subscribe to places changes:
```typescript
import { subscribeToPlaces } from './firebase/placesService';

const unsubscribe = subscribeToPlaces((places) => {
  console.log('Places updated:', places);
  // UI updates automatically
});

// Later, stop listening:
unsubscribe();
```

---

## 🔄 Unity Integration (Next Steps)

Now that your admin app has Firebase database, you can integrate with Unity:

### Unity Side:
1. **Add Firebase Unity SDK** to your project
2. **Download** `FirebaseDatabase.unitypackage` and `FirebaseFirestore.unitypackage`
3. **Add** `google-services.json` from Firebase Console
4. **Create** `DatabaseManager.cs` script

### Example Unity Script (Future Implementation):
```csharp
using Firebase.Firestore;
using System.Threading.Tasks;

[FirestoreData]
public class PlaceData {
    [FirestoreProperty] public string name { get; set; }
    [FirestoreProperty] public string displayName { get; set; }
    [FirestoreProperty] public Vector3 position { get; set; }
    [FirestoreProperty] public string building { get; set; }
    [FirestoreProperty] public int floor { get; set; }
    [FirestoreProperty] public bool isActive { get; set; }
}

public class DatabaseManager : MonoBehaviour {
    FirebaseFirestore db;
    
    void Start() {
        db = FirebaseFirestore.DefaultInstance;
        LoadPlaces();
    }
    
    async void LoadPlaces() {
        CollectionReference placesRef = db.Collection("places");
        QuerySnapshot snapshot = await placesRef.WhereEqualTo("isActive", true).GetSnapshotAsync();
        
        foreach (DocumentSnapshot doc in snapshot.Documents) {
            PlaceData place = doc.ConvertTo<PlaceData>();
            CreateNavigationTarget(place);
        }
    }
}
```

---

## 🐛 Troubleshooting

### Firebase Setup Wizard doesn't appear
- Clear localStorage: Open browser console → `localStorage.clear()` → Reload

### "Failed to parse Firebase config" error
- Go to **⚙️ Database** → Click "Reset Firebase Setup"
- Complete the wizard again carefully

### Database not initializing
- Check Firebase Console → Firestore is enabled
- Check browser console for detailed errors
- Verify Firebase config values are correct

### Offline mode not working
- Browser must support IndexedDB
- First load requires internet
- Subsequent loads work offline

---

## 📝 Summary

Your admin app now has:
✅ Complete Firebase Firestore integration  
✅ Guided setup wizard (3 steps)  
✅ Places CRUD with all operations  
✅ Buildings management system  
✅ Database initialization with sample data  
✅ Export/Import functionality  
✅ Connection status indicator  
✅ Offline persistence  
✅ Real-time update support  
✅ Error handling throughout  

**Ready to use!** Just complete the Firebase setup wizard and initialize the database. 🎉
