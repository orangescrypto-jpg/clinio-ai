import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../stores/useExamStore';
import { ExamResult, QuestionResult } from '../../types';

// Mock result data (in production, this comes from backend)
const MOCK_RESULTS: ExamResult = {
  id: 'result_1',
  score: 16,
  totalQuestions: 20,
  percentage: 80,
  timeSpentSeconds: 2700,
  questions: [
    {
      questionId: 'q1',
      stem: 'A 65-year-old patient with heart failure presents with dyspnea and bilateral crackles. Which medication should the nurse administer first?',
      userChoiceText: 'Furosemide (Lasix) 40mg IV',
      correctChoiceText: 'Furosemide (Lasix) 40mg IV',
      isCorrect: true,
      explanation: 'Furosemide is a loop diuretic that provides rapid relief of pulmonary congestion.',
      topicName: 'Heart Failure',
    },
    {
      questionId: 'q2',
      stem: 'Which finding indicates that digoxin therapy is effective?',
      userChoiceText: 'Decreased edema',
      correctChoiceText: 'Decreased edema',
      isCorrect: true,
      explanation: 'Digoxin improves cardiac output, increasing renal perfusion and reducing edema.',
      topicName: 'Heart Failure',
    },
  ],
};

export const ExamResultsContainer: React.FC = () => {
  const navigate = useNavigate();
  const { session, resetExam } = useExamStore();

  // Use mock results for now
  const result = MOCK_RESULTS;

  const handleBackToSetup = () => {
    resetExam();
    navigate('/exam');
  };

  const getGrade = (pct: number) => {
    if (pct >= 90) return { label: 'Excellent!', color: 'text-green-600', icon: '🌟' };
    if (pct >= 75) return { label: 'Great Job!', color: 'text-blue-600', icon: '👏' };
    if (pct >= 60) return { label: 'Good Effort', color: 'text-yellow-600', icon: '💪' };
    return { label: 'Keep Practicing', color: 'text-red-600', icon: '📚' };
  };

  const grade = getGrade(result.percentage);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Score Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-36 h-36 rounded-full border-4 border-primary-500 bg-primary-50 mb-4">
          <div>
            <p className="text-4xl font-bold text-primary-600">{result.percentage}%</p>
          </div>
        </div>
        <p className={`text-xl font-bold ${grade.color}`}>
          {grade.icon} {grade.label}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900">{result.totalQuestions}</p>
          <p className="text-xs text-gray-500">Questions</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{result.score}</p>
          <p className="text-xs text-gray-500">Correct</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-600">{result.totalQuestions - result.score}</p>
          <p className="text-xs text-gray-500">Incorrect</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900">{Math.floor(result.timeSpentSeconds / 60)}m</p>
          <p className="text-xs text-gray-500">Time Spent</p>
        </div>
      </div>

      {/* Answer Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Answer Review</h3>
        {result.questions.map((q, i) => (
          <div key={q.questionId} className={`card border-l-4 ${q.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Question {i + 1} · {q.topicName}</span>
              <span className={`text-sm font-medium ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {q.isCorrect ? '✅ Correct' : '❌ Incorrect'}
              </span>
            </div>
            <p className="text-sm text-gray-800 mb-3">{q.stem}</p>
            <div className="text-sm space-y-1 mb-3">
              <p><span className="text-gray-500">Your answer:</span> <span className={q.isCorrect ? 'text-green-600' : 'text-red-600'}>{q.userChoiceText || 'Not answered'}</span></p>
              {!q.isCorrect && (
                <p><span className="text-gray-500">Correct answer:</span> <span className="text-green-600">{q.correctChoiceText}</span></p>
              )}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Explanation:</p>
              <p className="text-sm text-gray-700">{q.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3 pb-8">
        <button onClick={handleBackToSetup} className="btn-primary w-full">
          Take Another Exam
        </button>
        <button onClick={() => navigate('/')} className="btn-secondary w-full">
          Back to Home
        </button>
      </div>
    </div>
  );
};
