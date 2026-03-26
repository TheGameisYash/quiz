import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Timer, FileCheck, Award, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { listenToActiveQuiz, signInWithGoogle, auth } from '../lib/firebase';
import { fetchAllQuestions } from '../lib/questionsStore';
import type { QuizSetting } from '../data/questions';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState<QuizSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = listenToActiveQuiz((active) => {
      setActiveQuiz(active);
      if (active) {
        localStorage.setItem('activeQuiz', JSON.stringify(active));
        // Ultra-Optimization: Zero-Latency Prefetching
        if (active.id) {
          fetchAllQuestions(active.id).catch(e => console.error("Prefetch error", e));
        }
      } else {
        localStorage.removeItem('activeQuiz');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
      setIsRegistered(true);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      const userData = {
        uid: user.uid,
        name: user.displayName || 'Student',
        email: user.email,
        photoURL: user.photoURL,
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setCurrentUser(userData);
      setIsRegistered(true);
    } catch (e: any) {
      console.error("Google Auth Error:", e);
      alert(`Failed to login with Google: ${e.message}`);
    }
  };

  const handleSignOut = () => {
    auth.signOut();
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsRegistered(false);
  };

  const handleStart = () => {
    navigate('/quiz');
  };

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
        Welcome to <span className="text-brand-500">{activeQuiz ? activeQuiz.name : 'Kanya Cutu Quiz 🌸'}</span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg sm:text-2xl text-text-light dark:text-text-dark mb-10 max-w-2xl font-medium"
      >
        {activeQuiz ? `Let's test your knowledge with this ${activeQuiz.totalQuestions}-question competitive assessment! 🎀` : 'Please wait for the administrator to activate a Quiz. ✨'}
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full max-w-3xl"
      >
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <FileCheck className="w-8 h-8 text-brand-500 mb-4" />
          <h3 className="font-semibold text-lg mb-1">{activeQuiz ? activeQuiz.totalQuestions : 0} Questions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Custom tailored assessment</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <Award className="w-8 h-8 text-brand-500 mb-4" />
          <h3 className="font-semibold text-lg mb-1">+{activeQuiz?.correctPoints || 0} / -{activeQuiz?.wrongDeduction || 0} Points</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Marking scheme applied</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <Timer className="w-8 h-8 text-brand-500 mb-4" />
          <h3 className="font-semibold text-lg mb-1">120 Minutes</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Time limit strictly enforced</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {isLoading ? (
          <div className="flex items-center text-slate-500">
             <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mr-3"></div> Connecting to Assessment Server...
          </div>
        ) : !activeQuiz ? (
          <div className="flex items-center px-6 py-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-xl border border-orange-200 dark:border-orange-800/50">
             <AlertCircle className="w-5 h-5 mr-3" /> No active quiz right now. Test offline.
          </div>
        ) : (
          activeQuiz && (
            <div className="w-full flex justify-center pb-12">
              {!isRegistered ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl"
                >
                  <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-2 text-center">Ready to Start?</h2>
                  <p className="text-slate-500 mb-6 text-center">Sign in with Google securely to begin {activeQuiz.name}.</p>

                  <Button onClick={handleGoogleLogin} className="w-full flex justify-center items-center py-4 text-base font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 shadow-sm transition-all gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 pr-6 rounded-full shadow-sm mb-4">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                        {currentUser?.name?.charAt(0) || 'S'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-heading-light dark:text-heading-dark">{currentUser?.name}</div>
                      <div className="text-xs text-slate-500">{currentUser?.email}</div>
                    </div>
                    <button onClick={handleSignOut} className="ml-4 p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/20 rounded-full" title="Sign Out">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleStart}
                    className="px-12 py-4 text-xl font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-brand-500/20 transition-all hover:-translate-y-1"
                  >
                    Start Assessment Engine
                  </Button>
                </motion.div>
              )}
            </div>
          )
        )}
      </motion.div>
    </div>
  );
};
