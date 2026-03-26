import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, Settings, Search } from 'lucide-react';
import { questions } from '../../data/questions';
import { QuestionCard } from '../../components/QuestionCard';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
  const [searchTerm, setSearchTerm] = useState('');

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
        
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium transition-colors">
          <FileText className="w-5 h-5" />
          Question Bank
        </button>
        
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium transition-colors">
          <Users className="w-5 h-5" />
          User Results <span className="ml-auto bg-slate-200 dark:bg-slate-700 text-xs px-2 py-0.5 rounded-full">Soon</span>
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
            <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark mb-1">Question Bank</h1>
            <p className="text-text-light dark:text-text-dark">Manage and view all 100 assessment questions.</p>
          </div>
          
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
        </div>

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

        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
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
