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
      <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        &copy; {new Date().getFullYear()} ProQuiz System. All rights reserved.
      </footer>
    </div>
  );
};
