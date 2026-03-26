import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, KeyRound } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect
  if (localStorage.getItem('isAdmin') === 'true') {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8 text-brand-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-heading-light dark:text-heading-dark mb-2">Admin Access</h2>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">Enter your credentials to manage the system</p>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-light dark:text-text-dark">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-heading-light dark:text-heading-dark focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-light dark:text-text-dark">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-heading-light dark:text-heading-dark focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth className="py-3">
              Sign In to Dashboard
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
