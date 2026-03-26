import React, { useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, RefreshCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { questions } from '../data/questions';
import { Button } from '../components/ui/Button';
import { saveQuizResult } from '../lib/firebase';

interface LocationState {
  answers: Record<number, number>;
}

export const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const resultSaved = useRef(false);

  if (!state || !state.answers) {
    return <Navigate to="/" replace />;
  }

  const { answers } = state;

  const resultStats = useMemo(() => {
    let partA_Score = 0;
    let partB_Score = 0;
    
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        if (q.part === 'A') partA_Score++;
        else partB_Score++;
      }
    });

    const totalScore = partA_Score + partB_Score;
    const percentage = (totalScore / questions.length) * 100;
    
    return {
      partA_Score,
      partB_Score,
      totalScore,
      percentage
    };
  }, [answers]);

  useEffect(() => {
    if (resultSaved.current || !state) return;
    
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const newResult = {
          name: currentUser.name,
          phone: currentUser.phone,
          partA_Score: resultStats.partA_Score,
          partB_Score: resultStats.partB_Score,
          totalScore: resultStats.totalScore,
          answers: state.answers,
          date: new Date().toISOString()
        };
        
        const existingResults = JSON.parse(localStorage.getItem('quiz_results') || '[]');
        existingResults.push(newResult);
        localStorage.setItem('quiz_results', JSON.stringify(existingResults));
        resultSaved.current = true;

        // Save to Firebase
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
            {resultStats.totalScore}<span className="text-3xl text-slate-400">/100</span>
          </div>
          <div className="text-lg font-medium text-slate-500">
            {resultStats.percentage}% Overall Score
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 w-full">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Part A: General</div>
            <div className="text-3xl font-bold text-heading-light dark:text-heading-dark">
              {resultStats.partA_Score} <span className="text-lg text-slate-400 font-medium">/ 25</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: `${(resultStats.partA_Score / 25) * 100}%` }} />
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Part B: Technical</div>
            <div className="text-3xl font-bold text-heading-light dark:text-heading-dark">
              {resultStats.partB_Score} <span className="text-lg text-slate-400 font-medium">/ 75</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full" style={{ width: `${(resultStats.partB_Score / 75) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
        </Button>
        <Button onClick={() => navigate('/quiz')}>
          <RefreshCcw className="w-5 h-5 mr-2" /> Retake Quiz
        </Button>
      </div>
    </div>
  );
};
