import { Roles } from "@/constants/roles";
import type { AppUser } from "@/types";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDocFromServer, setDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { collections } from "./firestore";

export const signInUser = async (email: string, password: string): Promise<AppUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const uid = userCredential.user.uid;
  const userDocRef = doc(collections.users, uid);
  
  // Always read from server (not cache) so we get the latest role
  const userDoc = await getDocFromServer(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as AppUser;
  }

  // No Firestore profile yet (e.g. account created via Firebase Console).
  // Auto-create a basic profile. Change role to 'admin' in Firestore Console if needed.
  const autoProfile: AppUser = {
    id: uid,
    name: userCredential.user.displayName ?? email.split("@")[0],
    email: email.trim().toLowerCase(),
    role: Roles.STUDENT,
  };

  await setDoc(userDocRef, autoProfile);
  return autoProfile;
};


export const registerUser = async (name: string, email: string, password: string, phone?: string): Promise<AppUser> => {
  if (!name.trim() || !email.trim() || password.trim().length < 6) {
    throw new Error("Please provide valid registration details.");
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const uid = userCredential.user.uid;

  const newUser: AppUser = {
    id: uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: Roles.STUDENT,
    ...(phone ? { phone: phone.trim() } : {})
  };

  await setDoc(doc(collections.users, uid), newUser);

  return newUser;
};

export const signOutUser = async (): Promise<void> => {
  await firebaseSignOut(auth);
};