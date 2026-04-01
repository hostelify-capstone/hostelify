import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "0000000000",
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:0000000000:web:demo"
};

const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const firebaseApp: FirebaseApp = app;
export const firebaseAuth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);