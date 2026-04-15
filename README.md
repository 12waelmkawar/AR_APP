# AR Navigation Admin App

Admin panel for managing places in the AR indoor navigation app.

## Features

- 🔐 PIN Code Authentication
- 📍 Places CRUD (Create, Read, Update, Delete)
- 🏢 Building & Floor Management
- 🎯 Position Tracking for AR
- 📊 Dashboard with Statistics

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Get your Firebase config from Project Settings
5. Update `src/firebase/config.ts` with your credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Set Admin PIN

Change the default PIN in `src/firebase/authService.ts`:

```typescript
const ADMIN_PIN = "1234"; // Change this!
```

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Default PIN

**1234** (remember to change it in production!)

## Firestore Security Rules

Add these rules to your Firestore to ensure only authenticated admins can modify data:

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

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Project Structure

```
admin_AR_app/
├── src/
│   ├── components/        # Reusable components
│   │   ├── PinAuth.tsx   # PIN authentication
│   │   └── Layout.tsx    # App layout with sidebar
│   ├── firebase/          # Firebase configuration
│   │   ├── config.ts     # Firebase init
│   │   ├── authService.ts # PIN auth logic
│   │   └── placesService.ts # Places CRUD
│   ├── pages/             # App pages
│   │   ├── Dashboard.tsx  # Stats overview
│   │   ├── Places.tsx     # Places list
│   │   └── PlaceForm.tsx  # Add/Edit form
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── *.css             # Styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Firebase Firestore** - Database
- **React Router 7** - Routing

## License

Private - For college use only
