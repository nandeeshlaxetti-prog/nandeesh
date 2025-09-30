# Firebase Configuration Setup Guide
# =====================================

# STEP 1: Create Firebase Project
# ------------------------------
# 1. Go to https://console.firebase.google.com/
# 2. Click "Create a project" or "Add project"
# 3. Enter project name: legal-desktop-app (or your preferred name)
# 4. Enable Google Analytics (optional)
# 5. Click "Create project"

# STEP 2: Enable Firestore Database
# ----------------------------------
# 1. In your Firebase project, go to "Firestore Database" in the left sidebar
# 2. Click "Create database"
# 3. Choose security rules:
#    - Start in test mode (for development)
#    - Start in production mode (for production)
# 4. Choose location: Select a region close to your users
# 5. Click "Done"

# STEP 3: Get Firebase Configuration
# ----------------------------------
# 1. Go to Project Settings: Click the gear icon ⚙️ next to "Project Overview"
# 2. Scroll down to "Your apps" section
# 3. Click "Add app" and select Web (</> icon)
# 4. Register your app:
#    - App nickname: Legal Desktop Web App
#    - Check "Also set up Firebase Hosting" if you want hosting
# 5. Copy the Firebase configuration

# STEP 4: Configure Environment Variables
# ----------------------------------------
# 1. Copy this file to .env.local in apps/web/
# 2. Replace the placeholder values below with your actual Firebase config
# 3. Restart your development server

# Firebase Configuration
# ======================
# Replace these values with your actual Firebase project configuration

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef

# Optional: Firebase Analytics
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Example Configuration (replace with your actual values):
# ======================================================
# NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key-here
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=legal-desktop-app.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=legal-desktop-app
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=legal-desktop-app.appspot.com
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
# NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# STEP 5: Test Firebase Integration
# --------------------------------
# 1. Start your development server: npm run dev
# 2. Go to http://localhost:3000/cases
# 3. Check the browser console for Firebase connection status
# 4. Try adding a case - it should sync to Firebase
# 5. Open multiple browser tabs to test real-time collaboration

# Security Rules (Optional)
# =========================
# For production, update your Firestore security rules:
# 
# rules_version = '2';
# service cloud.firestore {
#   match /databases/{database}/documents {
#     // Allow read/write access to all documents for authenticated users
#     match /{document=**} {
#       allow read, write: if request.auth != null;
#     }
#     
#     // Or for development/testing, allow all access:
#     match /{document=**} {
#       allow read, write: if true;
#     }
#   }
# }






