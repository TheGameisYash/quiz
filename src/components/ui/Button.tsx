import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25',
    secondary: 'bg-bg-dark text-white hover:bg-bg-dark/90 dark:bg-white dark:text-bg-dark dark:hover:bg-white/90',
    outline: 'border-2 border-slate-200 hover:border-brand-500 text-text-light dark:border-slate-800 dark:hover:border-brand-500 dark:text-text-dark',
    ghost: 'hover:bg-slate-100 text-text-light dark:hover:bg-slate-800 dark:text-text-dark',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
