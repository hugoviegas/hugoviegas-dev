import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore/lite";
import { getFirebase } from "./firebase";

export { isFirebaseConfigured } from "./firebase";

export type AccessResult = "granted" | "denied" | "error";

export type AdminUser = Pick<User, "uid" | "email">;

export const watchAuth = (callback: (user: AdminUser | null) => void) =>
  onAuthStateChanged(getFirebase().auth, callback);

// Google is the only enabled provider. Popup, not redirect: redirect breaks
// when the browser blocks third-party storage.
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(getFirebase().auth, provider);
};

export const signOutAdmin = () => signOut(getFirebase().auth);

// Only the owner may read admin/ping (see firestore.rules). The client never
// decides who is allowed; it only reacts to the rules' answer. Firestore Lite
// reads always go to the server, so a cached result cannot grant access.
export const checkOwnerAccess = async (): Promise<AccessResult> => {
  try {
    await getDoc(doc(getFirebase().db, "admin", "ping"));
    return "granted";
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "permission-denied") {
      return "denied";
    }
    return "error";
  }
};

// A closed or superseded popup is a user choice, not a failure.
export const isDismissedPopup = (error: unknown) =>
  error instanceof FirebaseError &&
  (error.code === "auth/popup-closed-by-user" ||
    error.code === "auth/cancelled-popup-request");
