import React, { useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, RefreshCcw, Sparkles, History } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../components/ui/Button';
import { saveQuizResult } from '../lib/firebase';
import type { QuizSetting, Question } from '../data/questions';

interface LocationState {
  answers: Record<number, number>;
  questions: Question[];
}

export const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const resultSaved = useRef(false);

  if (!state || !state.answers || !state.questions) {
    return <Navigate to="/" replace />;
  }

  const { answers, questions } = state;
  const activeQuizStr = localStorage.getItem('activeQuiz');
  const activeQuiz = activeQuizStr ? JSON.parse(activeQuizStr) as QuizSetting : null;

  const correctPoints = activeQuiz?.correctPoints || 1;
  const wrongDeduction = activeQuiz?.wrongDeduction || 0;

  const resultStats = useMemo(() => {
    let correctCount = 0;
    let wrongCount = 0;
    
    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer !== undefined) {
        if (userAnswer === q.answer) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    const baseScore = correctCount * correctPoints;
    const penalty = wrongCount * wrongDeduction;
    const finalScore = baseScore - penalty;
    const trueFinalScore = finalScore < 0 ? 0 : finalScore; // Don't allow negative total score visually if preferred, but usually exams allow negatives. Let's keep true score. 
    
    const maxScore = questions.length * correctPoints;
    const percentage = maxScore > 0 ? (trueFinalScore / maxScore) * 100 : 0;
    
    return {
      correctCount,
      wrongCount,
      totalScore: Number(trueFinalScore.toFixed(2)),
      percentage: Number(percentage.toFixed(2)),
      maxScore
    };
  }, [answers, questions, correctPoints, wrongDeduction]);

  useEffect(() => {
    if (resultSaved.current || !state) return;
    
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const newResult = {
          name: currentUser.name,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          quizId: activeQuiz?.id || 'legacy',
          quizName: activeQuiz?.name || 'Legacy Quiz',
          totalScore: resultStats.totalScore,
          correctCount: resultStats.correctCount,
          wrongCount: resultStats.wrongCount,
          answers: state.answers,
          date: new Date().toISOString()
        };
        
        const existingResults = JSON.parse(localStorage.getItem('quiz_results') || '[]');
        existingResults.push(newResult);
        localStorage.setItem('quiz_results', JSON.stringify(existingResults));
        resultSaved.current = true;

        saveQuizResult(newResult).catch(e => console.error(e));

        if (resultStats.percentage >= 40) {
          const duration = 3 * 1000;
          const end = Date.now() + duration;

          const frame = () => {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#ec4899', '#fbcfe8', '#db2777']
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#ec4899', '#fbcfe8', '#db2777']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();
        }
      } catch (e) {
        console.error("Error saving result", e);
      }
    }
  }, [resultStats, state]);

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center py-12">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, -5, 5, -5, 5, 0] }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative w-36 h-36 rounded-full border-[6px] border-white dark:border-slate-800 shadow-xl overflow-hidden mb-6 ring-4 ring-brand-500/30 group"
      >
        <img 
          src="/cutu3.jpg" 
          alt="My beautiful Cutu" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </motion.div>

      <h1 className="text-4xl font-bold text-heading-light dark:text-heading-dark mb-2 flex items-center gap-2">
        Yay! You did it! 🎉
      </h1>
      <p className="text-brand-500 dark:text-brand-400 font-medium mb-10 text-lg flex items-center gap-1.5">
        <Sparkles className="w-5 h-5" /> Here is your cute result, {state.answers ? JSON.parse(localStorage.getItem('currentUser') || '{}').name || 'Cutu' : 'Cutu'}! 💖
      </p>

      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm mb-8">
        <div className="flex flex-col items-center mb-10">
          <div className="text-7xl font-black text-brand-500 mb-2">
            {resultStats.totalScore}<span className="text-3xl text-slate-400">/{resultStats.maxScore}</span>
          </div>
          <div className="text-lg font-medium text-slate-500">
            {resultStats.percentage}% Overall Score
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 w-full">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Correct Answers</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-500">
              {resultStats.correctCount} <span className="text-lg text-slate-400 font-medium">/ {questions.length}</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: `${(resultStats.correctCount / questions.length) * 100}%` }} />
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Wrong Answers</div>
            <div className="text-3xl font-bold text-red-500">
              {resultStats.wrongCount} <span className="text-lg text-slate-400 font-medium">/ {questions.length}</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full" style={{ width: `${(resultStats.wrongCount / questions.length) * 100}%` }} />
            </div>
            {wrongDeduction > 0 && (
              <div className="text-xs text-slate-500 mt-2">Deducted: -{(resultStats.wrongCount * wrongDeduction).toFixed(2)} pts</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
        </Button>
        <Button variant="outline" onClick={() => navigate('/my-results')}>
          <History className="w-5 h-5 mr-2" /> View My History
        </Button>
        <Button onClick={() => navigate('/quiz')}>
          <RefreshCcw className="w-5 h-5 mr-2" /> Retake Quiz
        </Button>
      </div>
    </div>
  );
};
