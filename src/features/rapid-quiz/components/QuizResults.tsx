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
  const incorrect = total - correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const getGrade = (pct: number) => {
    if (pct >= 90) return { label: 'Excellent!', color: 'text-green-600', icon: '🌟' };
    if (pct >= 75) return { label: 'Great Job!', color: 'text-blue-600', icon: '👏' };
    if (pct >= 60) return { label: 'Good Effort', color: 'text-yellow-600', icon: '💪' };
    return { label: 'Keep Practicing', color: 'text-red-600', icon: '📚' };
  };

  const grade = getGrade(percentage);

  // Calculate time spent
  const startTime = new Date(session.startedAt).getTime();
  const endTime = session.completedAt ? new Date(session.completedAt).getTime() : Date.now();
  const timeSpent = Math.floor((endTime - startTime) / 1000);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 px-4">
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
            <span className="text-green-600">✅ Correct</span>
            <span className="font-semibold text-green-600">{correct}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600">❌ Incorrect</span>
            <span className="font-semibold text-red-600">{incorrect}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">⏱️ Time Spent</span>
            <span className="font-semibold">{formatTime(timeSpent)}</span>
          </div>
          <hr />
          <div className="flex justify-between">
            <span className="text-gray-600">Accuracy</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Answer Review</h3>
        {session.questions.map((q, i) => {
          const answer = session.answers[i];
          const isCorrect = answer?.isCorrect;
          const userChoice = q.question.choices.find(c => c.id === answer?.selectedChoiceId);
          const correctChoice = q.question.choices.find(c => c.id === q.question.correctAnswerId);

          return (
            <div key={q.question.id} className={`card border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Question {i + 1}</span>
                <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
              </div>
              <p className="text-sm text-gray-800 mb-3">{q.question.stem}</p>
              <div className="text-sm space-y-1 mb-3">
                <p>
                  <span className="text-gray-500">Your answer:</span>{' '}
                  <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {userChoice?.text || 'Not answered'}
                  </span>
                </p>
                {!isCorrect && (
                  <p>
                    <span className="text-gray-500">Correct answer:</span>{' '}
                    <span className="text-green-600 font-medium">{correctChoice?.text || 'N/A'}</span>
                  </p>
                )}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Explanation:</p>
                <p className="text-sm text-gray-700">{q.question.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="space-y-3 pb-8">
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
