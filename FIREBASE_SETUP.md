# Firebase Setup Guide for COMET Scanner Wizard

This guide will help you set up Firebase for your COMET Scanner Wizard application to ensure your data persists across devices and sessions.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "comet-scanner-wizard")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Register Your Web App

1. From the Firebase project dashboard, click the web icon (</>) to add a web app
2. Enter a nickname for your app (e.g., "COMET Scanner Wizard Web")
3. Check "Also set up Firebase Hosting" if you plan to deploy with Firebase
4. Click "Register app"
5. Copy the Firebase configuration object (we'll need this later)

## 3. Set Up Firestore Database

1. In the Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (recommended)
4. Select a location closest to your users
5. Click "Enable"

## 4. Create Firestore Collections

Create the following collections in Firestore:

1. **images** - For storing image data
2. **contents** - For storing content metadata
3. **userSettings** - For storing user settings

## 5. Set Up Firebase Storage

1. In the Firebase console, go to "Storage"
2. Click "Get started"
3. Choose "Start in production mode"
4. Click "Next"
5. Select a location closest to your users
6. Click "Done"

## 6. Configure Security Rules

### Firestore Rules

Go to Firestore Database > Rules and update with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated users
    match /images/{imageId} {
      allow write: if request.auth != null;
    }
    
    match /contents/{contentId} {
      allow write: if request.auth != null;
    }
    
    match /userSettings/{userId} {
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Rules

Go to Storage > Rules and update with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 7. Configure Environment Variables

Update your `.env.local` file with the Firebase configuration:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the placeholder values with the actual values from your Firebase configuration.

## 8. Deploy to Firebase Hosting (Optional)

If you want to deploy your app to Firebase Hosting:

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase in your project:
   ```
   firebase init
   ```
   - Select "Hosting"
   - Select your Firebase project
   - Specify "dist" as your public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: Optional

4. Build your app:
   ```
   npm run build
   ```

5. Deploy to Firebase:
   ```
   firebase deploy
   ```

## 9. Testing Your Firebase Setup

1. Start your development server:
   ```
   npm run dev
   ```

2. Log in to your application
3. Upload some images in the admin dashboard
4. Verify that the images are stored in Firebase Storage
5. Verify that the content metadata is stored in Firestore

## Troubleshooting

- **CORS Issues**: If you encounter CORS issues with Firebase Storage, you may need to configure CORS for your storage bucket. See [Firebase Storage CORS Configuration](https://firebase.google.com/docs/storage/web/download-files#cors_configuration).

- **Authentication Issues**: If you have issues with authentication, make sure your Firebase Authentication is properly set up and enabled for Email/Password authentication.

- **Quota Limits**: Be aware of Firebase's free tier limits. The free tier includes:
  - 1GB of Firestore storage
  - 10GB/month of Firebase Storage
  - 10GB/month of data transfer
  - 50,000 reads/day and 20,000 writes/day for Firestore

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
