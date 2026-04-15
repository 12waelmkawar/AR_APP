# Quick Start Guide

## 🚀 Running the App

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

2. **Enter PIN:** `1234` (default)

## 📋 Next Steps - Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "ar-navigation-admin")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Get Firebase Config

1. In Firebase Console, click the ⚙️ icon (Project Settings)
2. Scroll to "Your apps" section
3. Click the web icon `</>` to register a web app
4. Copy the `firebaseConfig` object
5. Paste it into `src/firebase/config.ts`

### 3. Enable Firestore

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in **test mode** (we'll add security rules later)
4. Choose a location close to you
5. Click "Enable"

### 4. Update Firebase Config

Open `src/firebase/config.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 5. Change the PIN (Important!)

Open `src/firebase/authService.ts` and change:

```typescript
const ADMIN_PIN = "1234"; // Change to your secure PIN
```

## 🎯 Using the Admin Panel

### Dashboard
- View total places count
- See active/inactive places
- View buildings list

### Add a Place
1. Click "Add Place" in sidebar or header
2. Fill in the form:
   - **Name**: Unique identifier (e.g., `room_a101`)
   - **Display Name**: User-friendly name (e.g., `Computer Science Lab`)
   - **Building**: Select from dropdown
   - **Floor**: Floor number
   - **Category**: Type of place
   - **Position**: X, Y, Z coordinates (from Unity scene)
   - **Vuforia Dataset**: AR tracking dataset
   - **Amenities**: Check applicable features
   - **Active**: Toggle visibility in app

### Edit/Delete Places
- Go to "Places" page
- Click "Edit" or "Delete" on any place

## 📦 Getting Position Coordinates

To find the correct X, Y, Z coordinates for a place:

1. Open your Unity project
2. Find the NavigationTarget in the scene
3. Look at the Transform component
4. Note the Position values (X, Y, Z)
5. Enter these in the admin form

## 🔒 Security (For Production)

1. **Change the PIN** to something secure
2. **Add Firebase Authentication** for admin users
3. **Set Firestore Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /places/{placeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎨 Customization

- **Change theme colors**: Update gradient values in CSS files
- **Add more buildings**: Edit `BUILDINGS` array in `PlaceForm.tsx`
- **Add more categories**: Edit `CATEGORIES` array in `PlaceForm.tsx`
- **Add more amenities**: Update the amenities list in `PlaceForm.tsx`

## 🐛 Troubleshooting

**App won't start:**
```bash
npm install
npm run dev
```

**Firebase errors:**
- Check your Firebase config in `src/firebase/config.ts`
- Make sure Firestore is enabled in your Firebase project
- Check browser console for detailed error messages

**Can't add places:**
- Make sure Firebase is properly configured
- Check that Firestore rules allow writes

## 📞 Need Help?

Check the main README.md for more detailed documentation.
