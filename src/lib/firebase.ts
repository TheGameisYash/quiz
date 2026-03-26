import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, setDoc, doc, where, deleteDoc, updateDoc, writeBatch, limit, onSnapshot } from "firebase/firestore";
import type { QuizSetting, Question } from "../data/questions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isConfigValid = !!firebaseConfig.apiKey;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

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

// --- QUIZZES ---
export const createQuizSetting = async (quiz: Omit<QuizSetting, 'id' | 'createdAt'>) => {
  if (!db) return null;
  if (quiz.isActive) {
    await turnOffOtherQuizzes(''); 
  }
  const qData = { ...quiz, createdAt: new Date().toISOString() };
  const docRef = await addDoc(collection(db, "quizzes"), qData);
  return docRef.id;
};

export const getQuizSettings = async (): Promise<QuizSetting[]> => {
  if (!db) return [];
  const qList = query(collection(db, "quizzes"));
  const querySnapshot = await getDocs(qList);
  const results: QuizSetting[] = [];
  querySnapshot.forEach((d) => {
    results.push({ ...(d.data() as Omit<QuizSetting, 'id'>), id: d.id });
  });
  return results.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getActiveQuizSetting = async (): Promise<QuizSetting | null> => {
  if (!db) return null;
  const activeQList = query(collection(db, "quizzes"), where("isActive", "==", true), limit(1));
  const querySnapshot = await getDocs(activeQList);
  if (querySnapshot.empty) return null;
  const d = querySnapshot.docs[0];
  return { ...(d.data() as Omit<QuizSetting, 'id'>), id: d.id };
};

export const listenToActiveQuiz = (callback: (quiz: QuizSetting | null) => void) => {
  if (!db) {
    callback(null);
    return () => {};
  }
  
  const activeQList = query(collection(db, "quizzes"), where("isActive", "==", true), limit(1));
  
  const unsubscribe = onSnapshot(activeQList, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
    } else {
      const d = snapshot.docs[0];
      callback({ ...(d.data() as Omit<QuizSetting, 'id'>), id: d.id });
    }
  }, (error) => {
    console.error("Live sync error: ", error);
  });
  
  return unsubscribe;
};

const turnOffOtherQuizzes = async (excludeId: string) => {
  if (!db) return;
  const all = await getQuizSettings();
  for (const q of all) {
    if (q.id && q.id !== excludeId && q.isActive) {
      await setDoc(doc(db, "quizzes", q.id), { isActive: false }, { merge: true });
    }
  }
};

export const updateQuizActiveStatus = async (quizId: string, isActive: boolean) => {
  if (!db) return;
  if (isActive) {
    await turnOffOtherQuizzes(quizId);
  }
  await setDoc(doc(db, "quizzes", quizId), { isActive }, { merge: true });
};

export const updateQuizSetting = async (quizId: string, updates: Partial<QuizSetting>) => {
  if (!db) return;
  if (updates.isActive) {
    await turnOffOtherQuizzes(quizId);
  }
  await updateDoc(doc(db, "quizzes", quizId), updates);
};

export const deleteQuizSetting = async (quizId: string) => {
  if (!db) return;
  const batch = writeBatch(db);
  
  // Delete the quiz
  batch.delete(doc(db, "quizzes", quizId));
  
  // Find and delete all questions efficiently
  const qList = query(collection(db, "questions"), where("quizId", "==", quizId));
  const querySnapshot = await getDocs(qList);
  querySnapshot.forEach((d) => {
    batch.delete(d.ref);
  });
  
  await batch.commit();
};

// --- QUESTIONS ---
export const addQuestionsBatch = async (questions: any[]) => {
  if (!db) {
    console.warn("Firebase not configured. Storing in local storage only.");
    if (questions.length > 0) {
      const custom = JSON.parse(localStorage.getItem(`custom_questions_${questions[0].quizId}`) || '[]');
      localStorage.setItem(`custom_questions_${questions[0].quizId}`, JSON.stringify([...custom, ...questions]));
    }
    return;
  }
  
  try {
    // Firestore batches have a limit of 500 operations
    const chunks = [];
    for (let i = 0; i < questions.length; i += 400) {
      chunks.push(questions.slice(i, i + 400));
    }
    
    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const q of chunk) {
        const newRef = doc(collection(db, "questions"));
        batch.set(newRef, q);
      }
      await batch.commit();
    }
  } catch (e) {
    console.error("Error batch adding questions: ", e);
    throw e;
  }
};

export const addQuestion = async (q: any) => {
  if (!db) {
    console.warn("Firebase not configured. Storing in local storage only.");
    const custom = JSON.parse(localStorage.getItem(`custom_questions_${q.quizId}`) || '[]');
    localStorage.setItem(`custom_questions_${q.quizId}`, JSON.stringify([...custom, q]));
    return null;
  }
  try {
    const docRef = await addDoc(collection(db, "questions"), q);
    return docRef.id;
  } catch (e) {
    console.error("Error adding question to Firebase: ", e);
    throw e;
  }
};

export const getQuestionsFromDB = async (quizId: string) => {
  if (!db) {
    const custom = JSON.parse(localStorage.getItem(`custom_questions_${quizId}`) || '[]');
    return custom;
  }
  try {
    const qList = query(collection(db, "questions"), where("quizId", "==", quizId));
    const querySnapshot = await getDocs(qList);
    const results: any[] = [];
    querySnapshot.forEach((d) => {
      results.push({ ...d.data(), firebaseId: d.id });
    });
    return results.sort((a,b) => a.id - b.id);
  } catch (e) {
    console.error("Error getting questions from Firebase: ", e);
    return [];
  }
};

export const updateQuestionInDB = async (firebaseId: string, updates: Partial<Question>) => {
  if (!db) return;
  try {
    const docRef = doc(db, "questions", firebaseId);
    await updateDoc(docRef, updates);
  } catch (e) {
    console.error('Error updating question:', e);
    throw e;
  }
};

// LIVE PRESENCE & MESSAGING SYSTEM
export const updateUserPresence = async (user: any, status: string) => {
  if (!db || !user?.uid) return;
  try {
    const docRef = doc(db, 'active_sessions', user.uid);
    await setDoc(docRef, {
      uid: user.uid,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      status: status,
      lastActive: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error("Presence update failed:", err);
  }
};

export const listenToActiveSessions = (callback: (sessions: any[]) => void) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  
  const sessionsQuery = query(collection(db, 'active_sessions'));
  
  return onSnapshot(sessionsQuery, (snapshot) => {
    const sessions = snapshot.docs.map(d => d.data());
    const recent = sessions.filter((s: any) => {
       const time = new Date(s.lastActive).getTime();
       return Date.now() - time < 5 * 60 * 1000;
    });
    recent.sort((a,b) => b.status.localeCompare(a.status));
    callback(recent);
  }, (err) => console.error("Active Sessions Error:", err));
};

export const sendMessageToUser = async (uid: string, text: string) => {
  if (!db) return;
  try {
    const docRef = doc(db, 'active_sessions', uid);
    await updateDoc(docRef, {
      latestMessage: {
        text,
        id: Date.now().toString(),
        read: false
      }
    });
  } catch (err) {
    console.error("Failed to send message", err);
    throw err;
  }
};

export const listenToMyMessages = (uid: string, callback: (msg: { text: string, id: string }) => void) => {
  if (!db || !uid) return () => {};
  const docRef = doc(db, 'active_sessions', uid);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.latestMessage && !data.latestMessage.read) {
        callback(data.latestMessage);
      }
    }
  });
};

export const markMessageAsRead = async (uid: string) => {
  if (!db) return;
  try {
    const docRef = doc(db, 'active_sessions', uid);
    await updateDoc(docRef, {
      "latestMessage.read": true
    });
  } catch (err) {}
};

export const deleteQuestionFromDB = async (firebaseId: string) => {
  if (!db) return;
  await deleteDoc(doc(db, "questions", firebaseId));
};
