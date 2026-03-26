import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { questions } from '../data/questions';
import { QuestionCard } from '../components/QuestionCard';
import { Button } from '../components/ui/Button';

export const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers]); // Added answers dependency so it submits current answers

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit the assessment?')) {
      navigate('/result', { state: { answers } });
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 relative items-start">
      {/* Left side: Navigation / Info */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-6 md:sticky md:top-28">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <Clock className={`w-8 h-8 mb-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-brand-500'}`} />
          <div className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-heading-light dark:text-heading-dark'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-slate-500 mt-1">Time Remaining</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-heading-light dark:text-heading-dark">Progress</h3>
            <span className="text-sm font-medium text-brand-500">{answeredCount}/{questions.length}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-6">
            <div 
              className="bg-brand-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    w-8 h-8 rounded-lg text-xs font-mono flex items-center justify-center transition-all
                    ${isCurrent ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900' : ''}
                    ${isAnswered ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}
                  `}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>

        <Button fullWidth onClick={handleSubmit} variant="primary" className="py-4">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Submit Quiz
        </Button>
      </div>

      {/* Right side: Question */}
      <div className="flex-1 w-full flex flex-col min-w-0">
        <QuestionCard 
          question={currentQuestion}
          selectedOption={answers[currentQuestion.id]}
          onSelectOption={handleSelectOption}
        />
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </Button>
          
          {!isLastQuestion ? (
            <Button onClick={handleNext}>
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
             <Button onClick={handleSubmit} variant="secondary">
              Review & Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
