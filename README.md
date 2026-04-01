# Hostelify

Hostelify is a React Native + Expo hostel management app using Expo Router, TypeScript, and Firebase-ready services.

## Tech Stack

- Expo + React Native
- Expo Router (file-based navigation)
- TypeScript
- Firebase (config/services scaffolded)

## Demo Accounts

- Student: `student@hostel.com`
- Admin: `admin@hostel.com`
- Password: any password with at least 6 characters

## Features

### Student

- Dashboard with 6 feature cards
- Complaints list + complaint submission form
- AI keyword-based complaint priority classification
- Notices feed
- Gate pass module (status flow scaffold)
- Mess feedback module
- Room details view
- Profile view

### Admin

- Dashboard with key stats
- Complaint management
- Student management scaffold
- Notice management
- Room management

## Project Structure

The project follows the requested structure with:

- `app/` for Expo Router screens
- `src/components/` for UI/forms/lists/modals/layout
- `src/hooks/` for app hooks
- `src/services/firebase/` for Firebase config/auth/firestore layers
- `src/constants/`, `src/types/`, `src/utils/`
- `assets/`, `functions/`, and `firebase/`

## Run Locally

```bash
npm install
npm run start
```

## Git Commands for Contributors

Use these commands so others can clone and edit the project correctly:

```bash
# 1) Clone the repository
git clone <your-repo-url>

# 2) Move into the project folder
cd hostelify

# 3) Create a new branch for your changes
git checkout -b feature/your-change-name

# 4) Make changes, then stage them
git add .

# 5) Commit with a clear message
git commit -m "Describe your change"

# 6) Push your branch
git push -u origin feature/your-change-name
```

After pushing, open a Pull Request on GitHub to merge your changes.

## Firebase Setup

Set these environment variables for real Firebase usage:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`