import { getQuestionsFromDB, addQuestion, updateQuestionInDB, deleteQuestionFromDB, addQuestionsBatch } from './firebase';
import type { Question } from '../data/questions';

const CACHE_KEY = (quizId: string) => `quiz_questions_cache_${quizId}`;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export const fetchAllQuestions = async (quizId: string): Promise<Question[]> => {
  if (!quizId) return [];
  
  try {
    const rawCache = sessionStorage.getItem(CACHE_KEY(quizId));
    if (rawCache) {
      const cache = JSON.parse(rawCache);
      if (Date.now() - cache.timestamp < CACHE_TTL) {
        return cache.data as Question[];
      }
    }

    const qs = await getQuestionsFromDB(quizId);
    
    if (qs && qs.length > 0) {
      sessionStorage.setItem(CACHE_KEY(quizId), JSON.stringify({
        data: qs,
        timestamp: Date.now()
      }));
    }
    
    return qs as Question[];
  } catch (e) {
    console.error("Failed to load questions", e);
    return [];
  }
};

export const saveNewQuestions = async (newQs: Question[]) => {
  if (newQs.length > 0) {
    await addQuestionsBatch(newQs);
    // Invalidate cache since we added new questions
    sessionStorage.removeItem(CACHE_KEY(newQs[0].quizId));
  }
};

export const updateExistingQuestion = async (firebaseId: string, updates: any) => {
  await updateQuestionInDB(firebaseId, updates);
  // Optional: We should probably invalidate the cache if we knew the quizId, 
  // but it's simpler to just clear all cache or let the admin refresh
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('quiz_questions_cache_')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const deleteExistingQuestion = async (firebaseId: string) => {
  await deleteQuestionFromDB(firebaseId);
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('quiz_questions_cache_')) {
      sessionStorage.removeItem(key);
    }
  });
};
