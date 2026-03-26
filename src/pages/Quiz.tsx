import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { fetchAllQuestions } from '../lib/questionsStore';
import type { Question, QuizSetting } from '../data/questions';
import { QuestionCard } from '../components/QuestionCard';
import { Button } from '../components/ui/Button';

export const Quiz: React.FC = () => {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : null;
  const activeQuizStr = localStorage.getItem('activeQuiz');
  const activeQuiz = activeQuizStr ? JSON.parse(activeQuizStr) as QuizSetting : null;

  const progressKey = user && activeQuiz ? `quiz_progress_${activeQuiz.id}_${user.phone}_${user.name}` : null;

  const [isLoadingQs, setIsLoadingQs] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledIds, setShuffledIds] = useState<number[]>([]);

  useEffect(() => {
    const initQuestions = async () => {
      if (!activeQuiz || !activeQuiz.id) {
        setIsLoadingQs(false);
        return;
      }
      setIsLoadingQs(true);
      const allQs = await fetchAllQuestions(activeQuiz.id);
      
      let activeIds: number[] = [];
      if (progressKey) {
        const saved = localStorage.getItem(progressKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.shuffledIds && parsed.shuffledIds.length > 0) {
             activeIds = parsed.shuffledIds;
          }
        }
      }

      if (activeIds.length === 0 && allQs.length > 0) {
        const shuffled = [...allQs].sort(() => Math.random() - 0.5);
        activeIds = shuffled.map(q => q.id);
      }
      
      setShuffledIds(activeIds);
      const loadedQs = activeIds.map(id => allQs.find(q => q.id === id)).filter(Boolean) as Question[];
      setQuestions(loadedQs);
      setIsLoadingQs(false);
    };
    initQuestions();
  }, [progressKey]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    if (progressKey) {
      const saved = localStorage.getItem(progressKey);
      if (saved) return JSON.parse(saved).currentQuestionIndex || 0;
    }
    return 0;
  });

  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    if (progressKey) {
      const saved = localStorage.getItem(progressKey);
      if (saved) return JSON.parse(saved).answers || {};
    }
    return {};
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    if (progressKey) {
      const saved = localStorage.getItem(progressKey);
      if (saved) return JSON.parse(saved).timeLeft || (120 * 60);
    }
    return 120 * 60; // 120 minutes in seconds
  });

  // Save progress whenever it changes
  useEffect(() => {
    if (progressKey && questions.length > 0) {
      localStorage.setItem(progressKey, JSON.stringify({
        shuffledIds,
        currentQuestionIndex,
        answers,
        timeLeft
      }));
    }
  }, [currentQuestionIndex, answers, timeLeft, progressKey, shuffledIds, questions.length]);

  useEffect(() => {
    if (!user) {
      navigate('/register', { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    if (isLoadingQs || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoadingQs, questions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  if (isLoadingQs) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-heading-light dark:text-heading-dark">Loading your Quiz...</h2>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-4">No Questions Available!</h2>
          <p className="text-slate-500 mb-6">The database is currently empty. Please ask the Admin to upload questions via the Dashboard.</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev: Record<number, number>) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev: number) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev: number) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit the assessment?')) {
      if (progressKey) {
        localStorage.removeItem(progressKey);
      }
      navigate('/result', { state: { answers, questions } });
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 relative items-start">
      {/* Left side: Navigation / Info */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-6 md:sticky md:top-28">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <Clock className={`w-8 h-8 mb-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-brand-500'}`} />
          <div className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-heading-light dark:text-heading-dark'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-slate-500 mt-1">Time Remaining</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-heading-light dark:text-heading-dark text-lg">Question Map</h3>
            <div className="text-xs font-bold px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full border border-brand-100 dark:border-brand-800 shadow-sm">
              {answeredCount}/{questions.length} Attempted
            </div>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
            <div 
              className="bg-brand-500 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>

          <div className="flex gap-4 text-xs font-semibold text-slate-500 mb-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-500 shadow-sm"></div> Attempted
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"></div> Skipped
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar pb-2">
            {questions.map((q: Question, idx: number) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center transition-all shadow-sm
                    ${isCurrent ? 'ring-4 ring-brand-500/30 scale-110' : 'hover:scale-110'}
                    ${isAnswered 
                      ? 'bg-brand-500 text-white' 
                      : (isCurrent 
                          ? 'bg-white dark:bg-slate-900 border-2 border-brand-500 text-brand-600 dark:text-brand-400' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700')}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <Button fullWidth onClick={handleSubmit} variant="primary" className="py-4">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Submit Quiz
        </Button>
      </div>

      {/* Right side: Question */}
      <div className="flex-1 w-full flex flex-col min-w-0">
        <QuestionCard 
          question={currentQuestion}
          selectedOption={answers[currentQuestion.id]}
          onSelectOption={handleSelectOption}
        />
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </Button>
          
          {!isLastQuestion ? (
            <Button onClick={handleNext}>
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
             <Button onClick={handleSubmit} variant="secondary">
              Review & Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
