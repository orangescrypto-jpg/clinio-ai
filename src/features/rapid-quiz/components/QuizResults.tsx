import React from 'react';
import { useQuizStore } from '../../../stores/useQuizStore';

interface Props {
  onRetry: () => void;
  onHome: () => void;
}

export const QuizResults: React.FC<Props> = ({ onRetry, onHome }) => {
  const { session, score } = useQuizStore();

  if (!session) return null;

  const total = session.questions.length;
  const correct = score.correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const getGrade = (pct: number) => {
    if (pct >= 90) return { label: 'Excellent!', color: 'text-green-600', icon: '🌟' };
    if (pct >= 75) return { label: 'Great Job!', color: 'text-blue-600', icon: '👏' };
    if (pct >= 60) return { label: 'Good Effort', color: 'text-yellow-600', icon: '💪' };
    return { label: 'Keep Practicing', color: 'text-red-600', icon: '📚' };
  };

  const grade = getGrade(percentage);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Score Circle */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary-500 bg-primary-50 mb-4">
          <div>
            <p className="text-3xl font-bold text-primary-600">{percentage}%</p>
          </div>
        </div>
        <p className={`text-xl font-bold ${grade.color}`}>
          {grade.icon} {grade.label}
        </p>
      </div>

      {/* Stats */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Quiz Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Questions</span>
            <span className="font-semibold">{total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">Correct</span>
            <span className="font-semibold text-green-600">{correct}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600">Incorrect</span>
            <span className="font-semibold text-red-600">{total - correct}</span>
          </div>
          <hr />
          <div className="flex justify-between">
            <span className="text-gray-600">Accuracy</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={onRetry} className="btn-primary w-full">
          Try Another Quiz
        </button>
        <button onClick={onHome} className="btn-secondary w-full">
          Back to Home
        </button>
      </div>
    </div>
  );
};
