# 🔥 Where to Find Your Firebase Data

## ❌ You're Looking At: Realtime Database
URL: `https://arapp-4d777-default-rtdb.firebaseio.com/`

**This is NOT where the app stores data!**

The app uses **Firestore Database**, not Realtime Database.

---

## ✅ Look Here Instead: Firestore Database

### Step 1: Go to Firebase Console
https://console.firebase.google.com/

### Step 2: Select Your Project
Click on: **arapp-4d777**

### Step 3: Open Firestore
In the left sidebar, click: **"Firestore Database"**

### Step 4: View Your Data
You should see:
```
places (collection)
  └── {document-id}
      ├── name: "room_a101"
      ├── displayName: "Computer Science Lab"
      └── ... (other fields)

buildings (collection)
  └── {document-id}
      ├── name: "Bloc Blue"
      └── ... (other fields)
```

---

## 🔧 If Firestore is Empty

If you don't see any data in Firestore:

1. **Complete the Setup Wizard** in the admin app
   - The wizard should appear when you open the app
   - Follow the 3 steps

2. **Initialize the Database**
   - Enter PIN: `1234`
   - Go to ⚙️ Database in sidebar
   - Click "Initialize Database"
   - This adds sample data

3. **Check Firebase Console**
   - Go back to Firestore Database page
   - Refresh the page
   - You should see your collections and documents

---

## 🆚 Realtime Database vs Firestore

Your Firebase project has TWO databases:

### Realtime Database (The one you're looking at)
- URL: `https://arapp-4d777-default-rtdb.firebaseio.com/`
- Format: JSON tree
- Used for: Simple real-time sync
- **Status: ❌ NOT used by this app**

### Firestore Database (Where data is stored)
- URL: Accessed via Firebase Console → Firestore Database
- Format: Collections & Documents
- Used for: Complex data, queries
- **Status: ✅ Used by this app**

---

## 📱 Quick Links

**Firebase Console (Main Dashboard):**
https://console.firebase.google.com/project/arapp-4d777/overview

**Firestore Database (Your Data):**
https://console.firebase.google.com/project/arapp-4d777/firestore

**Realtime Database (Not Used):**
https://console.firebase.google.com/project/arapp-4d777/database/arapp-4d777/default-rtdb/data

---

## 💡 Still Don't See Data?

### Check These:

1. **Firebase Config is Correct**
   - In admin app, open browser console (F12)
   - Type: `localStorage.getItem('firebase_config')`
   - Should show your Firebase config JSON
   - Verify the `projectId` is `arapp-4d777`

2. **Firestore is Enabled**
   - In Firebase Console → Firestore Database
   - Should NOT say "Create database"
   - Should show a data editor

3. **Database was Initialized**
   - In admin app, go to ⚙️ Database
   - Click "Initialize Database"
   - Wait for success message

4. **Check Browser Console for Errors**
   - Press F12 → Console tab
   - Look for red error messages
   - Screenshot them if you see any

---

## 🎯 TL;DR

**Your data IS saved** - you're just looking in the wrong place!

❌ Don't look at: Realtime Database
✅ Look at: Firebase Console → Firestore Database
