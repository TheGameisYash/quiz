import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, ChevronUp, Trophy, ArrowLeft, BookOpen, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { getMyQuizResults } from '../lib/firebase';
import { fetchAllQuestions } from '../lib/questionsStore';
import type { Question } from '../data/questions';

interface ResultRecord {
  id: string;
  quizId: string;
  quizName: string;
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount?: number;
  answers: Record<number, number>;
  date: string;
}

const ScoreBadge: React.FC<{ score: number; maxScore: number }> = ({ score, maxScore }) => {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const color =
    pct >= 70 ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    : pct >= 40 ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
    : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold ${color}`}>
      {score} / {maxScore}
    </span>
  );
};

const BreakdownPanel: React.FC<{ result: ResultRecord }> = ({ result }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (result.quizId && result.quizId !== 'legacy') {
      setLoading(true);
      fetchAllQuestions(result.quizId).then((qs) => {
        setQuestions(qs);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [result.quizId]);

  if (loading) {
    return (
      <div className="px-6 py-8 text-center text-slate-400 animate-pulse">
        Loading question breakdown...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="px-6 py-6 text-slate-500 text-sm">
        <p className="mb-3">Detailed per-question view is unavailable (quiz may have been deleted).</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Correct: <span className="text-green-500 font-bold">{result.correctCount}</span></li>
          <li>Wrong: <span className="text-red-500 font-bold">{result.wrongCount}</span></li>
          <li>Skipped: <span className="text-slate-400 font-bold">{result.unattemptedCount ?? (questions.length - result.correctCount - result.wrongCount)}</span></li>
        </ul>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 space-y-3">
      {questions.map((q, idx) => {
        const userAnswer = result.answers ? result.answers[q.id] : undefined;
        const isAttempted = userAnswer !== undefined && userAnswer !== null;
        const isCorrect = isAttempted && userAnswer === q.answer;

        return (
          <div
            key={q.id}
            className={`rounded-xl border p-4 ${
              isCorrect
                ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800/50'
                : isAttempted
                ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/50'
                : 'border-slate-200 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              ) : isAttempted ? (
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              ) : (
                <MinusCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              )}
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                Q{idx + 1}. {q.question}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
              {q.options.map((opt, oIdx) => {
                const isUserChoice = oIdx === userAnswer;
                const isTrueAnswer = oIdx === q.answer;

                let badge = '';
                if (isTrueAnswer && isUserChoice) badge = '✅ Correct';
                else if (isTrueAnswer && !isUserChoice) badge = '📍 Right Answer';
                else if (!isTrueAnswer && isUserChoice) badge = '❌ Your Choice';

                return (
                  <div
                    key={oIdx}
                    className={`px-3 py-2.5 rounded-lg text-sm flex justify-between items-center gap-2 ${
                      isTrueAnswer
                        ? 'bg-green-100 text-green-900 font-medium dark:bg-green-800/50 dark:text-green-100'
                        : isUserChoice
                        ? 'bg-red-100 text-red-900 font-medium dark:bg-red-800/50 dark:text-red-100'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                    {badge && <span className="text-xs font-bold whitespace-nowrap">{badge}</span>}
                  </div>
                );
              })}
            </div>
            {!isAttempted && (
              <p className="ml-8 mt-2 text-xs text-slate-400 italic font-medium">Skipped</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const MyResults: React.FC = () => {
  const navigate = useNavigate();
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  const [results, setResults] = useState<ResultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.email) return;
    setLoading(true);
    getMyQuizResults(currentUser.email).then((data) => {
      setResults(data as ResultRecord[]);
      setLoading(false);
    });
  }, [currentUser?.email]);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <div className="flex items-center gap-4">
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="" className="w-14 h-14 rounded-full ring-4 ring-brand-500/20 shadow-md" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              {currentUser.name?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black text-heading-light dark:text-heading-dark flex items-center gap-3">
              <History className="w-8 h-8 text-brand-500" />
              My Quiz History
            </h1>
            <p className="text-slate-500 mt-0.5">{currentUser.name} · {currentUser.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Strip */}
      {!loading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 text-center shadow-sm">
            <div className="text-3xl font-black text-brand-500 mb-1">{results.length}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attempts</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 text-center shadow-sm">
            <div className="text-3xl font-black text-green-500 mb-1">
              {results.reduce((s, r) => s + (r.correctCount || 0), 0)}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Correct</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 text-center shadow-sm">
            <div className="text-3xl font-black text-heading-light dark:text-heading-dark mb-1">
              {results.length > 0
                ? (results.reduce((s, r) => s + r.totalScore, 0) / results.length).toFixed(1)
                : 0}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Score</div>
          </div>
        </motion.div>
      )}

      {/* Results List */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 animate-pulse">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          Loading your quiz history...
        </div>
      ) : results.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
        >
          <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">No quizzes taken yet</h3>
          <p className="text-slate-400 mb-6">Complete your first assessment to see the breakdown here.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Go to Home
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {results.map((result, i) => {
            const isOpen = expandedId === result.id;
            const totalQs = (result.correctCount || 0) + (result.wrongCount || 0) + (result.unattemptedCount ?? 0);
            const maxScore = totalQs; // approximate; real maxScore requires quiz settings

            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Card Header — always visible */}
                <button
                  onClick={() => toggleExpand(result.id)}
                  className="w-full text-left px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-heading-light dark:text-heading-dark truncate">
                        {result.quizName || 'Quiz'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(result.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 shrink-0 ml-14 sm:ml-0">
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-500 font-bold">✅ {result.correctCount}</span>
                      <span className="text-red-500 font-bold">❌ {result.wrongCount}</span>
                    </div>
                    <ScoreBadge score={result.totalScore} maxScore={maxScore || result.correctCount + result.wrongCount} />
                    <div className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </button>

                {/* Expandable Breakdown */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="breakdown"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                    >
                      <BreakdownPanel result={result} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
