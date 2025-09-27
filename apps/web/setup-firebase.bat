@echo off
echo Creating Firebase environment file...
echo.
echo Please enter your Firebase configuration values:
echo.

set /p API_KEY="Enter your Firebase API Key: "
set /p PROJECT_ID="Enter your Firebase Project ID: "
set /p AUTH_DOMAIN="Enter your Firebase Auth Domain: "
set /p STORAGE_BUCKET="Enter your Firebase Storage Bucket: "
set /p MESSAGING_SENDER_ID="Enter your Firebase Messaging Sender ID: "
set /p APP_ID="Enter your Firebase App ID: "

echo.
echo Creating .env.local file...

(
echo # Firebase Configuration
echo # Generated on %date% %time%
echo.
echo NEXT_PUBLIC_FIREBASE_API_KEY=%API_KEY%
echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=%AUTH_DOMAIN%
echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=%PROJECT_ID%
echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=%STORAGE_BUCKET%
echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=%MESSAGING_SENDER_ID%
echo NEXT_PUBLIC_FIREBASE_APP_ID=%APP_ID%
echo NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
) > .env.local

echo.
echo ✅ .env.local file created successfully!
echo.
echo Next steps:
echo 1. Restart your development server: npm run dev
echo 2. Go to http://localhost:3000/cases
echo 3. Check the browser console for Firebase connection status
echo 4. Try adding a case to test cloud storage
echo.
pause




