import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, Settings, Search, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { questions } from '../../data/questions';
import { QuestionCard } from '../../components/QuestionCard';
import { getQuizResults } from '../../lib/firebase';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'USERS'>('A');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    setSelectedUser(null);
    if (activeTab === 'USERS') {
      const fetchResults = async () => {
        const localResults = JSON.parse(localStorage.getItem('quiz_results') || '[]');
        
        try {
          const firebaseResults = await getQuizResults();
          const allResults = [...firebaseResults, ...localResults];
          // Remove duplicates based on date
          const uniqueResults = Array.from(new Map(allResults.map(item => [item.date, item])).values());
          uniqueResults.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setUsers(uniqueResults);
        } catch (error) {
          console.error('Failed to fetch from Firebase, using local only', error);
          setUsers(localResults.reverse());
        }
      };
      fetchResults();
    }
  }, [activeTab]);

  // Check auth
  if (localStorage.getItem('isAdmin') !== 'true') {
    return <Navigate to="/admin" replace />;
  }

  const filteredQuestions = questions.filter(
    (q) => q.part === activeTab && q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 py-4">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">Menu</div>
        
        <button 
          onClick={() => setActiveTab('A')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab !== 'USERS' ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
        >
          <FileText className="w-5 h-5" />
          Question Bank
        </button>
        
        <button 
          onClick={() => setActiveTab('USERS')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'USERS' ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
        >
          <Users className="w-5 h-5" />
          User Results
        </button>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark mb-1">
              {activeTab === 'USERS' ? (selectedUser ? `${selectedUser.name}'s Results` : 'User Results') : 'Question Bank'}
            </h1>
            <p className="text-text-light dark:text-text-dark">
              {activeTab === 'USERS' ? (selectedUser ? `Reviewing detailed answers for this assessment.` : 'View all completed assessment results.') : 'Manage and view all 100 assessment questions.'}
            </p>
          </div>
          
          {activeTab !== 'USERS' && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('A')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'A' ? 'bg-white dark:bg-slate-700 shadow-sm text-heading-light dark:text-heading-dark' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Part A (General)
              </button>
              <button
                onClick={() => setActiveTab('B')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'B' ? 'bg-white dark:bg-slate-700 shadow-sm text-heading-light dark:text-heading-dark' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Part B (Technical)
              </button>
            </div>
          )}
        </div>

        {activeTab !== 'USERS' && (
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
        )}

        <div className="space-y-6">
          {activeTab === 'USERS' ? (
            selectedUser ? (
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="flex items-center text-brand-500 hover:text-brand-600 transition-colors font-medium mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Users
                </button>
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark">{selectedUser.name}</h3>
                    <p className="text-slate-500">{selectedUser.phone} • Taken on {new Date(selectedUser.date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center min-w-[80px]">
                      <div className="text-xs text-slate-500 mb-1">Part A</div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">{selectedUser.partA_Score}/25</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-center min-w-[80px]">
                      <div className="text-xs text-slate-500 mb-1">Part B</div>
                      <div className="font-bold text-brand-600 dark:text-brand-400">{selectedUser.partB_Score}/75</div>
                    </div>
                    <div className="bg-brand-500/10 p-3 rounded-xl text-center min-w-[80px]">
                      <div className="text-xs text-brand-600 dark:text-brand-400 mb-1">Total</div>
                      <div className="font-bold text-brand-600 dark:text-brand-400 text-lg">{selectedUser.totalScore}%</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">Detailed Answers</h3>
                  {questions.map((q) => {
                    const userAnswer = selectedUser.answers ? selectedUser.answers[q.id] : undefined;
                    const isCorrect = userAnswer === q.answer;
                    const isUnanswered = userAnswer === undefined;
                    
                    return (
                      <div key={q.id} className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm ${isCorrect ? 'border-green-200 dark:border-green-900/30 ring-1 ring-green-500/20' : isUnanswered ? 'border-slate-200 dark:border-slate-800' : 'border-red-200 dark:border-red-900/30 ring-1 ring-red-500/20'}`}>
                        <div className="flex justify-between items-start mb-4 gap-4">
                          <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">
                            <span className="text-brand-500 mr-2">Q{q.id}.</span>
                            {q.question}
                          </h3>
                          <div className="shrink-0 mt-1">
                            {isCorrect ? (
                              <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-4 h-4 mr-1" /> Correct</span>
                            ) : isUnanswered ? (
                              <span className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">Not Answered</span>
                            ) : (
                              <span className="flex items-center text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full"><XCircle className="w-4 h-4 mr-1" /> Incorrect</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {q.options.map((opt, optIdx) => {
                            const isUserChoice = userAnswer === optIdx;
                            const isActualCorrect = q.answer === optIdx;
                            
                            let optStyle = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-text-light dark:text-text-dark";
                            if (isActualCorrect) {
                              optStyle = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 ring-1 ring-green-500/30";
                            } else if (isUserChoice && !isCorrect) {
                              optStyle = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 ring-1 ring-red-500/30";
                            }

                            return (
                              <div key={optIdx} className={`p-4 rounded-xl border ${optStyle} flex items-center`}>
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0 bg-white/50 dark:bg-black/20">
                                  {String.fromCharCode(65 + optIdx)}
                                </div>
                                <span className="font-medium">{opt}</span>
                                {isUserChoice && <span className="ml-auto text-xs font-bold uppercase tracking-wider opacity-70">User Choice</span>}
                                {isActualCorrect && !isUserChoice && <span className="ml-auto text-xs font-bold uppercase tracking-wider opacity-70">Correct Answer</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-medium">Student Name</th>
                        <th className="px-6 py-4 font-medium">Phone Number</th>
                        <th className="px-6 py-4 font-medium">Part A (25)</th>
                        <th className="px-6 py-4 font-medium">Part B (75)</th>
                        <th className="px-6 py-4 font-medium">Total (100)</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium cursor-default border-none"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No results recorded yet.</td>
                        </tr>
                      ) : (
                        users.map((u: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-heading-light dark:text-heading-dark">{u.name}</td>
                            <td className="px-6 py-4 text-text-light dark:text-text-dark">{u.phone}</td>
                            <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-medium">{u.partA_Score}</td>
                            <td className="px-6 py-4 text-brand-600 dark:text-brand-400 font-medium">{u.partB_Score}</td>
                            <td className="px-6 py-4 font-bold text-heading-light dark:text-heading-dark">{u.totalScore}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{new Date(u.date).toLocaleString()}</td>
                            <td className="px-4 py-4 text-right">
                              <button 
                                onClick={() => setSelectedUser(u)}
                                className="text-brand-500 hover:text-brand-600 font-medium text-xs px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 rounded-lg transition-colors whitespace-nowrap"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No questions found matching your search.</div>
          ) : (
            filteredQuestions.map((q) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <QuestionCard
                  question={q}
                  selectedOption={null}
                  onSelectOption={() => {}}
                  showAnswer={true}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
