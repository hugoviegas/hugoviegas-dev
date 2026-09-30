// Firebase for the hidden admin page only. Import this module from the lazy
// admin chunk, never from public pages: the public site must not load the SDK.
import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore/lite";

// Public web config. These values identify the project; they are not
// credentials. Access control lives in firestore.rules.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(config).every(Boolean);

let services: { auth: Auth; db: Firestore } | null = null;

export const getFirebase = () => {
  if (!services) {
    const app = initializeApp(config);
    services = { auth: getAuth(app), db: getFirestore(app) };
  }
  return services;
};
