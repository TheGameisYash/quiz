export type QuizSetting = {
  id?: string;
  name: string;
  totalQuestions: number;
  correctPoints: number;
  wrongDeduction: number;
  isActive: boolean;
  createdAt: string;
};

export type Question = {
  id: number;
  quizId: string;
  part: 'A' | 'B';
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
  firebaseId?: string;
};

export const questions: Question[] = [];
