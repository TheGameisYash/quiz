import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isConfigValid = !!firebaseConfig.apiKey;

export const app = isConfigValid && !getApps().length ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;

export const saveQuizResult = async (resultData: any) => {
  if (!db) {
    console.warn("Firebase not configured. Falling back to local storage only.");
    return null;
  }
  try {
    const docRef = await addDoc(collection(db, "quiz_results"), resultData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document to Firebase: ", e);
    throw e;
  }
};

export const getQuizResults = async () => {
  if (!db) {
    return [];
  }
  try {
    const q = query(collection(db, "quiz_results"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const results: any[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  } catch (e) {
    console.error("Error getting documents from Firebase: ", e);
    return [];
  }
};
