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
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        className="relative w-40 h-40 rounded-[2.5rem] md:rounded-full border-[6px] border-white dark:border-slate-800 shadow-2xl overflow-hidden mb-8 ring-4 ring-brand-500/30 group cursor-pointer"
      >
        <img 
          src="/cutu1.jpg" 
          alt="My beautiful Cutu" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-brand-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500"></div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-5xl sm:text-7xl font-black text-heading-light dark:text-heading-dark mb-6 tracking-tight drop-shadow-sm"
      >
        Welcome to <span className="text-brand-500">Kanya Cutu Quiz</span> 🌸
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg sm:text-2xl text-text-light dark:text-text-dark mb-10 max-w-2xl font-medium"
      >
        Let's test your knowledge with our cute 100-question assessment! 🎀 Ready cutu? ✨
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
        <Button size="lg" onClick={() => navigate('/register')} className="px-12 py-5 text-xl font-bold">
          Start Assessment Now
        </Button>
      </motion.div>
    </div>
  );
};
