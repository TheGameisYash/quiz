import React from 'react';
import { motion } from 'framer-motion';
import type { Question } from '../data/questions';

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  showAnswer?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  showAnswer = false,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-500 bg-brand-500/10 rounded-full">
          Part {question.part} &bull; {question.topic}
        </span>
        <span className="text-sm text-slate-400 font-mono">Q.{question.id}</span>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-semibold text-heading-light dark:text-heading-dark mb-8 leading-snug">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = question.answer === index;
          
          let optionStateClass = "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-text-light dark:text-text-dark";
          
          if (showAnswer) {
            if (isCorrect) {
              optionStateClass = "bg-green-50 border-green-500 text-green-900 dark:bg-green-500/10 dark:text-green-400";
            } else if (isSelected && !isCorrect) {
              optionStateClass = "bg-red-50 border-red-500 text-red-900 dark:bg-red-500/10 dark:text-red-400";
            } else {
              optionStateClass = "opacity-50 bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700";
            }
          } else if (isSelected) {
            optionStateClass = "bg-brand-500/5 border-brand-500 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400";
          }

          return (
            <motion.button
              key={index}
              whileTap={!showAnswer ? { scale: 0.98 } : {}}
              onClick={() => !showAnswer && onSelectOption(index)}
              disabled={showAnswer}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${optionStateClass}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-semibold border ${showAnswer && isCorrect ? 'bg-green-500 text-white border-green-500' : showAnswer && isSelected && !isCorrect ? 'bg-red-500 text-white border-red-500' : isSelected ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600'}`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1 text-base">{option}</span>
            </motion.button>
          );
        })}
      </div>

      {showAnswer && question.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl"
        >
          <div className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Explanation</div>
          <p className="text-blue-900/80 dark:text-blue-200/80 text-sm">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
};
