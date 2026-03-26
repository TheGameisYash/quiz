import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, LogIn, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminLoggedIn = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-bg-light/80 dark:bg-bg-dark/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-brand-500/10 rounded-xl group-hover:bg-brand-500/20 transition-colors">
              <BrainCircuit className="w-6 h-6 text-brand-500" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-heading-light dark:text-heading-dark">
              Kanya <span className="text-brand-500">Cutu</span> Quiz
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAdminRoute ? (
              isAdminLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : null
            ) : (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-500 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
