# Firebase Configuration Setup

## Quick Setup Instructions

### 1. Get Your Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon ⚙️)
4. Scroll to **"Your apps"** section
5. If no web app exists, click **"Add app"** → **Web** (</> icon)
6. Copy the configuration values

### 2. Create Environment File
Create a file named `.env.local` in the `apps/web/` directory with this content:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Replace Placeholder Values
Replace the placeholder values with your actual Firebase configuration:

- `your-api-key-here` → Your actual API key
- `your-project-id` → Your actual project ID
- `123456789012` → Your actual messaging sender ID
- `1:123456789012:web:abcdef1234567890abcdef` → Your actual app ID

### 4. Test Firebase Integration
1. Restart your development server: `npm run dev`
2. Go to `http://localhost:3000/cases`
3. Check browser console for Firebase connection status
4. Try adding a case - it should sync to Firebase
5. Open multiple browser tabs to test real-time collaboration

### 5. Verify Firestore Collections
Your Firestore database should have these collections:
- `cases` - For storing case data
- `users` - For user presence tracking
- `activities` - For activity logging

## Example Configuration
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=legal-desktop-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=legal-desktop-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=legal-desktop-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Troubleshooting
- **Firebase not connecting**: Check your API key and project ID
- **Permission denied**: Update Firestore security rules
- **CORS errors**: Ensure your domain is authorized in Firebase
- **Environment variables not loading**: Restart your development server






