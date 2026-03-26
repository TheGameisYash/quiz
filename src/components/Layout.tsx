import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <div>&copy; {new Date().getFullYear()} Kanya Cutu Quiz.</div>
        <div className="mt-2 text-base font-semibold text-brand-500 dark:text-brand-400 flex items-center justify-center gap-1.5">
          Made with 💖 for Cutu ✨
        </div>
      </footer>
    </div>
  );
};
