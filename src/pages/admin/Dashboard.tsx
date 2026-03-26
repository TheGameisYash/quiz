import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, Settings, Search, ArrowLeft, CheckCircle2, XCircle, PlusCircle, BookOpen, ToggleLeft, ToggleRight, Trash2, Edit, Save, X, Activity, Send, Clock } from 'lucide-react';
import { fetchAllQuestions, saveNewQuestions } from '../../lib/questionsStore';
import { getQuizSettings, createQuizSetting, updateQuizSetting, deleteQuizSetting, updateQuizActiveStatus, getQuizResults, deleteQuestionFromDB, updateQuestionInDB, listenToActiveSessions, sendMessageToUser } from '../../lib/firebase';
import type { Question, QuizSetting } from '../../data/questions';
import { QuestionCard } from '../../components/QuestionCard';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'QUIZZES' | 'QUESTIONS' | 'USERS' | 'LIVE'>('QUIZZES');
  
  // Quizzes State
  const [quizzes, setQuizzes] = useState<QuizSetting[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSetting | null>(null);

  // Quiz Form State (used for both Create and Update)
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [quizForm, setQuizForm] = useState({
    id: '', 
    name: '', 
    totalQuestions: 100, 
    correctPoints: 1, 
    wrongDeduction: 0.25
  });

  // Questions State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQs, setIsLoadingQs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingQuestions, setIsAddingQuestions] = useState(false);
  const [questionsText, setQuestionsText] = useState('');
  const [answersText, setAnswersText] = useState('');

  // Single Question Edit State
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editQForm, setEditQForm] = useState({ question: '', options: ['','','',''], answer: 0 });

  // Users State
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedUserQuestions, setSelectedUserQuestions] = useState<Question[]>([]);
  const [isLoadingUserQs, setIsLoadingUserQs] = useState(false);

  // Pagination & Search Debounce
  const ITEMS_PER_PAGE = 10;
  const [questionsPage, setQuestionsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setQuestionsPage(1); // Reset page on search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Live Monitor State
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [messages, setMessages] = useState<Record<string, string>>({}); 
  const [sendingMsgId, setSendingMsgId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'LIVE') {
      const unsubscribe = listenToActiveSessions((sessions) => {
        setLiveSessions(sessions);
      });
      return () => unsubscribe();
    }
  }, [activeTab]);

  const handleSendLiveMessage = async (uid: string) => {
    const text = messages[uid]?.trim();
    if (!text) return;
    setSendingMsgId(uid);
    try {
      await sendMessageToUser(uid, text);
      setMessages(prev => ({ ...prev, [uid]: '' }));
    } catch (e) {
      alert("Failed to send message: " + e);
    }
    setSendingMsgId(null);
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setIsLoadingQuizzes(true);
    const qs = await getQuizSettings();
    setQuizzes(qs);
    setIsLoadingQuizzes(false);
  };

  const openQuizCreateForm = () => {
    setQuizForm({ id: '', name: '', totalQuestions: 100, correctPoints: 1, wrongDeduction: 0.25 });
    setIsQuizFormOpen(true);
  };

  const openQuizEditForm = (q: QuizSetting) => {
    setQuizForm({
      id: q.id!,
      name: q.name,
      totalQuestions: q.totalQuestions,
      correctPoints: q.correctPoints,
      wrongDeduction: q.wrongDeduction
    });
    setIsQuizFormOpen(true);
  };

  const handleSaveQuiz = async () => {
    if (!quizForm.name) return alert("Please enter a quiz name");
    try {
      if (quizForm.id) {
        // Update
        await updateQuizSetting(quizForm.id, {
          name: quizForm.name,
          totalQuestions: quizForm.totalQuestions,
          correctPoints: quizForm.correctPoints,
          wrongDeduction: quizForm.wrongDeduction
        });
      } else {
        // Create
        await createQuizSetting({
          name: quizForm.name,
          totalQuestions: quizForm.totalQuestions,
          correctPoints: quizForm.correctPoints,
          wrongDeduction: quizForm.wrongDeduction,
          isActive: false
        });
      }
      setIsQuizFormOpen(false);
      loadQuizzes();
    } catch(e) {
      alert("Error saving quiz");
    }
  };

  const handleDeleteQuiz = async (id: string, name: string) => {
    if (window.confirm(`WARNING: Are you absolutely sure you want to delete "${name}"? Everyone's access will be removed and ALL questions belonging to it will be permanently deleted as well.`)) {
      await deleteQuizSetting(id);
      if (selectedQuiz?.id === id) {
        setSelectedQuiz(null);
        setActiveTab('QUIZZES');
      }
      loadQuizzes();
    }
  };

  const handleToggleActive = async (quiz: QuizSetting) => {
    if (!quiz.id) return;
    await updateQuizActiveStatus(quiz.id, !quiz.isActive);
    loadQuizzes();
  };

  const loadQuestionsForQuiz = async (quiz: QuizSetting) => {
    if (!quiz.id) return;
    setSelectedQuiz(quiz);
    setActiveTab('QUESTIONS');
    setIsAddingQuestions(false);
    setIsLoadingQs(true);
    const qs = await fetchAllQuestions(quiz.id);
    setQuestions(qs);
    setIsLoadingQs(false);
  };

  const handleBulkAdd = async () => {
    if (!selectedQuiz || !selectedQuiz.id) return;
    
    const lines = questionsText.split('\n').filter(l => l.trim() !== '');
    const keys = answersText.split(',').map(k => k.trim().toUpperCase());

    if (lines.length !== keys.length && lines.length > 0) {
      alert(`Error: You provided ${lines.length} questions but ${keys.length} answers! They must match exactly.`);
      return;
    }
    if (lines.length === 0) {
      alert('Please enter some questions.'); return;
    }

    try {
      let startId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) : 1000;

      const newQs = lines.map((line, idx) => {
        const parts = line.split(',');
        const qText = parts[0].trim();
        const options = parts.slice(1).map(p => p.trim());

        let ansStr = keys[idx] || 'A';
        let ansIdx = 0;
        if (['A','B','C','D'].includes(ansStr)) {
          ansIdx = ansStr.charCodeAt(0) - 65;
        } else {
          ansIdx = parseInt(ansStr) - 1;
          if (isNaN(ansIdx)) ansIdx = 0;
        }

        return {
          id: ++startId,
          quizId: selectedQuiz.id as string,
          part: 'A', // default generic
          topic: 'Custom',
          question: qText,
          options: options.length >= 4 ? options.slice(0, 4) : ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: ansIdx
        } as Question;
      });

      await saveNewQuestions(newQs);
      alert(`Successfully added ${newQs.length} questions!`);
      setQuestionsText('');
      setAnswersText('');
      
      setIsLoadingQs(true);
      const updatedQs = await fetchAllQuestions(selectedQuiz.id);
      setQuestions(updatedQs);
      setIsAddingQuestions(false);
      setIsLoadingQs(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save questions to database.');
    }
  };

  const handleEditQClick = (q: Question) => {
    setEditingQuestionId(q.firebaseId!);
    setEditQForm({ question: q.question, options: [...q.options], answer: q.answer });
  };

  const handleSaveQEdit = async () => {
    if (!editingQuestionId) return;
    await updateQuestionInDB(editingQuestionId, editQForm);
    setEditingQuestionId(null);
    loadQuestionsForQuiz(selectedQuiz!);
  };

  const handleDeleteQ = async (firebaseId: string) => {
    if (window.confirm("Are you sure you want to delete this question permanently?")) {
      await deleteQuestionFromDB(firebaseId);
      loadQuestionsForQuiz(selectedQuiz!);
    }
  };

  useEffect(() => {
    setSelectedUser(null);
    if (activeTab === 'USERS') {
      const fetchResults = async () => {
        try {
          const firebaseResults = await getQuizResults();
          setUsers(firebaseResults);
        } catch (error) {
          console.error('Failed to fetch from Firebase', error);
        }
      };
      fetchResults();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedUser && selectedUser.quizId && selectedUser.quizId !== 'legacy') {
      setIsLoadingUserQs(true);
      fetchAllQuestions(selectedUser.quizId).then(qs => {
        setSelectedUserQuestions(qs);
        setIsLoadingUserQs(false);
      });
    } else {
      setSelectedUserQuestions([]);
      setIsLoadingUserQs(false);
    }
  }, [selectedUser]);

  if (localStorage.getItem('isAdmin') !== 'true') {
    return <Navigate to="/admin" replace />;
  }

  const filteredQuestions = useMemo(() => {
    if (!debouncedSearch) return questions;
    return questions.filter((q) => q.question.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [questions, debouncedSearch]);

  const paginatedQuestions = useMemo(() => {
    const start = (questionsPage - 1) * ITEMS_PER_PAGE;
    return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuestions, questionsPage]);

  const totalQPages = Math.max(1, Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE));

  const paginatedUsers = useMemo(() => {
    const start = (usersPage - 1) * ITEMS_PER_PAGE;
    return users.slice(start, start + ITEMS_PER_PAGE);
  }, [users, usersPage]);

  const totalUPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 py-4 px-4 sm:px-6 lg:px-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">Menu</div>
        
        <button 
          onClick={() => { setActiveTab('QUIZZES'); setSelectedQuiz(null); setIsQuizFormOpen(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'QUIZZES' ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
        >
          <BookOpen className="w-5 h-5" />
          Manage Quizzes
        </button>

        {selectedQuiz && (
          <button 
            onClick={() => setActiveTab('QUESTIONS')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'QUESTIONS' ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            <FileText className="w-5 h-5" />
            Questions Bank
          </button>
        )}
        
        <button 
          onClick={() => setActiveTab('LIVE')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'LIVE' ? 'bg-brand-500 text-white shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
        >
          <Activity className={`w-5 h-5 ${activeTab === 'LIVE' ? 'animate-pulse' : ''}`} />
          Live Monitor
          {liveSessions.length > 0 && activeTab !== 'LIVE' && (
             <span className="ml-auto w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          )}
        </button>
        
        <button 
          onClick={() => setActiveTab('USERS')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'USERS' ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
        >
          <Users className="w-5 h-5" />
          User Results
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0">
        
        {/* QUIZZES TAB */}
        {activeTab === 'QUIZZES' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark mb-1">Manage Quizzes</h1>
                <p className="text-text-light dark:text-text-dark">Create quizzes, edit settings, and activate tests.</p>
              </div>
              <button
                onClick={openQuizCreateForm}
                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center shadow-sm"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Create New Quiz
              </button>
            </div>

            {isQuizFormOpen && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-8 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-heading-light dark:text-heading-dark">{quizForm.id ? 'Edit Quiz' : 'New Quiz Setup'}</h2>
                  <button onClick={() => setIsQuizFormOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Quiz Name</label>
                    <input type="text" value={quizForm.name} onChange={e => setQuizForm({...quizForm, name: e.target.value})} placeholder="e.g. Group 5 Paramedical" className="w-full bg-slate-50 dark:bg-slate-800 border px-4 py-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Questions Expected</label>
                    <input type="number" value={quizForm.totalQuestions} onChange={e => setQuizForm({...quizForm, totalQuestions: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border px-4 py-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Points per Correct Answer</label>
                    <input type="number" step="0.5" value={quizForm.correctPoints} onChange={e => setQuizForm({...quizForm, correctPoints: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border px-4 py-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Points Deducted per Wrong Answer</label>
                    <input type="number" step="0.05" value={quizForm.wrongDeduction} onChange={e => setQuizForm({...quizForm, wrongDeduction: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border px-4 py-2 rounded-lg" />
                  </div>
                </div>
                <button onClick={handleSaveQuiz} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center">
                   <Save className="w-5 h-5 mr-2" /> Save Form Properties
                </button>
              </div>
            )}

            {isLoadingQuizzes ? (
              <div className="text-center py-12 text-slate-500">Loading quizzes...</div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-medium">Quiz Name</th>
                      <th className="px-6 py-4 font-medium">Questions</th>
                      <th className="px-6 py-4 font-medium">Scoring (+/-)</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {quizzes.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No quizzes created yet.</td></tr>
                    ) : (
                      quizzes.map((q) => (
                        <tr key={q.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${q.isActive ? 'bg-brand-50 dark:bg-brand-900/10' : ''}`}>
                          <td className="px-6 py-4 font-bold text-heading-light dark:text-heading-dark">{q.name}</td>
                          <td className="px-6 py-4">{q.totalQuestions}</td>
                          <td className="px-6 py-4"><span className="text-green-600 font-bold">+{q.correctPoints}</span> / <span className="text-red-500 font-bold">-{q.wrongDeduction}</span></td>
                          <td className="px-6 py-4">
                            <button onClick={() => handleToggleActive(q)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${q.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                              {q.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              {q.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </button>
                          </td>
                          <td className="px-6 py-4 space-x-2 flex">
                            <button onClick={() => loadQuestionsForQuiz(q)} className="text-brand-500 hover:text-brand-600 font-medium text-xs px-3 py-1.5 bg-brand-500/10 rounded-lg">Content</button>
                            <button onClick={() => openQuizEditForm(q)} className="text-slate-500 hover:text-slate-700 font-medium text-xs px-2 py-1.5 bg-slate-100 rounded-lg" title="Edit Properties"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteQuiz(q.id!, q.name)} className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1.5 bg-red-100 rounded-lg" title="Delete Quiz entirely"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === 'QUESTIONS' && selectedQuiz && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
              <div>
                 <button onClick={() => setActiveTab('QUIZZES')} className="flex items-center text-sm font-medium text-brand-500 mb-2 hover:text-brand-600"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Quizzes</button>
                 <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark">{selectedQuiz.name} Questions</h1>
                 <p className="text-text-light dark:text-text-dark">Manage questions for this specific assessment.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsAddingQuestions(!isAddingQuestions)} className={`${isAddingQuestions ? 'bg-slate-200 text-slate-700' : 'bg-brand-500 text-white'} px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center shadow-sm`}>
                  {isAddingQuestions ? 'Cancel' : <><PlusCircle className="w-4 h-4 mr-2" /> Bulk Add</>}
                </button>
              </div>
            </div>

            {isAddingQuestions && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-8">
                <h2 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-4">Bulk Upload to {selectedQuiz.name}</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Questions & Options (Comma separated format)</label>
                    <textarea 
                      rows={6} value={questionsText} onChange={(e) => setQuestionsText(e.target.value)}
                      placeholder="e.g. Which planet is known as the Red Planet?, Earth, Mars, Jupiter, Venus"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Answer Keys</label>
                    <input 
                      type="text" value={answersText} onChange={(e) => setAnswersText(e.target.value)}
                      placeholder="e.g. B, A, C, D"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
                    />
                  </div>
                  <button onClick={handleBulkAdd} className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-6 rounded-xl shadow-md w-full sm:w-auto">
                    Parse & Add
                  </button>
                </div>
              </div>
            )}

            {!isAddingQuestions && (
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text" placeholder="Search specific questions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-500 transition-colors"
                />
              </div>
            )}

            {isLoadingQs ? (
              <div className="text-center py-12 text-slate-500">Loading questions from cloud...</div>
            ) : filteredQuestions.length === 0 && !isAddingQuestions ? (
              <div className="text-center py-12 text-slate-500">No questions found! Click Add Questions above.</div>
            ) : !isAddingQuestions ? (
              <>
               <div className="space-y-4">
                 {paginatedQuestions.map((q) => {
                    const isEditing = editingQuestionId === q.firebaseId;

                    return isEditing ? (
                      <div key={q.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-brand-500 shadow-lg">
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-1 text-slate-700">Question Text</label>
                          <textarea value={editQForm.question} onChange={e => setEditQForm({...editQForm, question: e.target.value})} className="w-full border rounded-xl p-3 bg-slate-50 h-24" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          {editQForm.options.map((opt, idx) => (
                            <div key={idx}>
                              <label className="block text-sm font-semibold mb-1 text-slate-700">Option {String.fromCharCode(65 + idx)}</label>
                              <div className="flex items-center gap-2">
                                <input type="radio" checked={editQForm.answer === idx} onChange={() => setEditQForm({...editQForm, answer: idx})} title="Set as correct answer" />
                                <input type="text" value={opt} onChange={e => {
                                  const newOpts = [...editQForm.options];
                                  newOpts[idx] = e.target.value;
                                  setEditQForm({...editQForm, options: newOpts}); 
                                }} className="w-full border rounded-xl p-2 bg-slate-50" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleSaveQEdit} className="flex items-center bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-bold"><Save className="w-4 h-4 mr-2" /> Save</button>
                          <button onClick={() => setEditingQuestionId(null)} className="flex items-center bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold"><X className="w-4 h-4 mr-2" /> Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div key={q.id} className="relative group">
                         <QuestionCard question={q} selectedOption={null} onSelectOption={() => {}} showAnswer={true} />
                         <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1.5 rounded-xl backdrop-blur-sm border shadow-sm">
                           <button onClick={() => handleEditQClick(q)} className="p-2 text-slate-600 hover:text-brand-500 bg-slate-100 hover:bg-brand-50 rounded-lg" title="Edit text/answer"><Edit className="w-4 h-4" /></button>
                           <button onClick={() => handleDeleteQ(q.firebaseId!)} className="p-2 text-slate-600 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded-lg" title="Delete Question"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                    )
                 })}
               </div>
               
               {totalQPages > 1 && (
                 <div className="flex justify-center items-center gap-4 mt-6">
                   <button onClick={() => setQuestionsPage(p => Math.max(1, p - 1))} disabled={questionsPage === 1} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">Previous</button>
                   <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">Page {questionsPage} of {totalQPages}</span>
                   <button onClick={() => setQuestionsPage(p => Math.min(totalQPages, p + 1))} disabled={questionsPage === totalQPages} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">Next</button>
                 </div>
               )}
              </>
            ) : null}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'USERS' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark mb-1">
                {selectedUser ? `${selectedUser.name}'s Results` : 'User Results'}
              </h1>
              <p className="text-text-light dark:text-text-dark">
                {selectedUser ? `Reviewing detailed answers for this assessment.` : 'View all completed quiz results across the platform.'}
              </p>
            </div>

            {selectedUser ? (
              <div className="space-y-6">
                <button onClick={() => setSelectedUser(null)} className="flex items-center text-brand-500 hover:text-brand-600 transition-colors font-medium mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Users
                </button>
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark">{selectedUser.name} <span className="text-sm font-normal text-slate-500 ml-2">({selectedUser.quizName || 'Legacy Quiz'})</span></h3>
                    <p className="text-slate-500">{selectedUser.email || selectedUser.phone} • Taken on {new Date(selectedUser.date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-brand-500/10 p-3 rounded-xl text-center min-w-[100px]">
                      <div className="text-xs text-brand-600 dark:text-brand-400 mb-1">Final Score</div>
                      <div className="font-bold text-brand-600 dark:text-brand-400 text-lg">{selectedUser.totalScore}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">Detailed Answer Breakdown</h3>
                  
                  {isLoadingUserQs ? (
                    <div className="text-slate-400 py-4 animate-pulse">Loading exact exam questions to render breakdown...</div>
                  ) : selectedUserQuestions.length > 0 ? (
                    <div className="space-y-4 mt-6">
                      {selectedUserQuestions.map((q, idx) => {
                        const userAnswer = selectedUser.answers ? selectedUser.answers[q.id] : undefined;
                        const isAttempted = userAnswer !== undefined && userAnswer !== null;
                        const isCorrect = isAttempted && userAnswer === q.answer;
                        
                        return (
                          <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' : isAttempted ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : 'border-slate-200 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Q{idx + 1}. {q.question}</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                              {q.options.map((opt, oIdx) => {
                                const isUserChoice = oIdx === userAnswer;
                                const isTrueAnswer = oIdx === q.answer;
                                
                                let badge = '';
                                if (isTrueAnswer && isUserChoice) badge = '✅ Correct';
                                else if (isTrueAnswer && !isUserChoice) badge = '📍 Correct Option';
                                else if (!isTrueAnswer && isUserChoice) badge = '❌ Your Entry';
                                
                                return (
                                  <div key={oIdx} className={`p-3 rounded-lg flex justify-between items-center ${isTrueAnswer ? 'bg-green-200/50 text-green-900 font-medium dark:bg-green-800 dark:text-green-100' : isUserChoice ? 'bg-red-200/50 text-red-900 font-medium dark:bg-red-800 dark:text-red-100' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                                    <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                    {badge && <span className="text-xs font-bold">{badge}</span>}
                                  </div>
                                )
                              })}
                            </div>
                            {!isAttempted && <div className="mt-3 text-sm font-semibold text-slate-400 italic">Skipped Question</div>}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-slate-500 border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50 dark:bg-slate-900">
                      <p>Note: Detailed answers are not available for this record. Either the quiz was deleted or it is a legacy version.</p>
                      <ul className="mt-4 list-disc list-inside space-y-1">
                        <li>Correct Answers: <span className="text-green-500 font-bold">{selectedUser.correctCount || 0}</span></li>
                        <li>Wrong Answers: <span className="text-red-500 font-bold">{selectedUser.wrongCount || 0}</span></li>
                        <li>Unattempted: <span className="text-slate-400 font-bold">{selectedUser.unattemptedCount || 0}</span></li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-medium">Student Name</th>
                        <th className="px-6 py-4 font-medium">Quiz Taken</th>
                        <th className="px-6 py-4 font-medium">Final Score</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium cursor-default border-none"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {users.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No results recorded yet.</td></tr>
                      ) : (
                        paginatedUsers.map((u: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-heading-light dark:text-heading-dark">
                              <div className="flex items-center gap-3">
                                {u.photoURL ? (
                                  <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full shadow-sm" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs">{u.name?.charAt(0) || '?'}</div>
                                )}
                                <div>
                                  {u.name}<br/>
                                  <span className="text-xs font-normal text-slate-500">{u.email || u.phone || 'No Contact Info'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-text-light dark:text-text-dark">{u.quizName || 'Legacy Quiz'}</td>
                            <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">{u.totalScore}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{new Date(u.date).toLocaleString()}</td>
                            <td className="px-4 py-4 text-right">
                              <button onClick={() => setSelectedUser(u)} className="text-brand-500 hover:text-brand-600 font-medium text-xs px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 rounded-lg whitespace-nowrap">View Detailed Breakdown</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {totalUPages > 1 && (
                    <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <button onClick={() => setUsersPage(p => Math.max(1, p - 1))} disabled={usersPage === 1} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">Previous</button>
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Page {usersPage} of {totalUPages}</span>
                      <button onClick={() => setUsersPage(p => Math.min(totalUPages, p + 1))} disabled={usersPage === totalUPages} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">Next</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIVE STANDINGS TAB */}
        {activeTab === 'LIVE' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark mb-1 flex items-center">
                <Activity className="w-8 h-8 mr-3 text-brand-500 animate-pulse" /> Live Monitor
              </h1>
              <p className="text-text-light dark:text-text-dark">
                Watch identically who is viewing the app or actively taking tests right now.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveSessions.length === 0 ? (
                <div className="col-span-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Nobody's Online Right Now</h3>
                  <p>When students access the platform or run tests, they will instantly appear here.</p>
                </div>
              ) : (
                liveSessions.map(session => (
                    <div key={session.uid} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full relative overflow-hidden group">
                      {session.status.includes('Testing') && (
                        <div className="absolute top-0 inset-x-0 h-1 bg-brand-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
                      )}
                      <div className="flex items-center gap-4 mb-4">
                        {session.photoURL ? (
                          <img src={session.photoURL} alt="" className="w-12 h-12 rounded-full shadow-md" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center font-bold text-white text-lg shadow-md">{session.name?.charAt(0) || '?'}</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-heading-light dark:text-heading-dark truncate border-b border-transparent">{session.name}</h4>
                          <p className="text-xs font-mono text-slate-500 truncate mt-0.5">{session.email}</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-5 flex-1 shadow-inner border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          {session.status.includes('Testing') ? (
                             <span className="flex h-3 w-3 relative">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                             </span>
                          ) : (
                            <Activity className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-sm font-bold dark:text-slate-200">{session.status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          Pinging: {new Date(session.lastActive).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="flex gap-2 items-center mt-auto relative">
                        <input
                           type="text"
                           placeholder="Type a cute message..."
                           value={messages[session.uid] || ''}
                           onChange={e => setMessages(prev => ({...prev, [session.uid]: e.target.value}))}
                           className="flex-1 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 pr-12 placeholder-slate-400 transition-all font-medium"
                           onKeyDown={(e) => e.key === 'Enter' && handleSendLiveMessage(session.uid)}
                        />
                        <button 
                           onClick={() => handleSendLiveMessage(session.uid)}
                           disabled={sendingMsgId === session.uid || !messages[session.uid]?.trim()}
                           className={`absolute right-2 p-1.5 rounded-lg transition-colors ${
                              sendingMsgId === session.uid || !messages[session.uid]?.trim() 
                              ? 'text-slate-400 bg-transparent' 
                              : 'text-white bg-brand-500 hover:bg-brand-600 shadow-md hover:-translate-y-0.5'
                           }`}
                        >
                           <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
