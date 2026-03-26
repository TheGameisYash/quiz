import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, PlayCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      localStorage.setItem('currentUser', JSON.stringify({ name: name.trim(), phone: phone.trim() }));
      navigate('/quiz');
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [5, -5, 5, -5, 0] }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="w-24 h-24 rounded-full border-4 border-brand-500/30 shadow-md overflow-hidden relative"
          >
            <img 
              src="/cutu2.jpg" 
              alt="Cutu Registration" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-center text-heading-light dark:text-heading-dark mb-2">Welcome Cutu! 💖</h2>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">Please enter your information to begin your sweet assessment 🎀</p>

        <form onSubmit={handleStart} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-light dark:text-text-dark">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-heading-light dark:text-heading-dark focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-text-light dark:text-text-dark">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-heading-light dark:text-heading-dark focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth className="py-3">
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
