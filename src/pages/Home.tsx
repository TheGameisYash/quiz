import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Timer, FileCheck, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-brand-500/10 rounded-3xl flex items-center justify-center mb-8"
      >
        <BrainCircuit className="w-12 h-12 text-brand-500" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-4xl sm:text-6xl font-black text-heading-light dark:text-heading-dark mb-6 tracking-tight"
      >
        Welcome to <span className="text-brand-500">ProQuiz</span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg sm:text-xl text-text-light dark:text-text-dark mb-12 max-w-2xl"
      >
        Test your knowledge with our comprehensive 100-question assessment. Covering General Knowledge and Technical Dialysis topics.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full max-w-3xl"
      >
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <FileCheck className="w-8 h-8 text-brand-500 mb-4" />
          <h3 className="font-semibold text-lg mb-1">100 Questions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">25 General, 75 Technical</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <Timer className="w-8 h-8 text-brand-500 mb-4" />
          <h3 className="font-semibold text-lg mb-1">120 Minutes</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Time limit strictly enforced</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <Award className="w-8 h-8 text-brand-500 mb-4" />
          <h3 className="font-semibold text-lg mb-1">Instant Results</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detailed performance breakdown</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Button size="lg" onClick={() => navigate('/quiz')} className="px-12 py-5 text-xl font-bold">
          Start Assessment Now
        </Button>
      </motion.div>
    </div>
  );
};
