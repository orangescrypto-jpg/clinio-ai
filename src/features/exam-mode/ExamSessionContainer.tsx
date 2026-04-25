import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../../stores/useExamStore';

export const ExamSessionContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    session,
    currentQuestion,
    currentIndex,
    timeRemaining,
    isSubmitted,
    answerQuestion,
    toggleFlag,
    nextQuestion,
    previousQuestion,
    jumpToQuestion,
    submitExam,
  } = useExamStore();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);

  if (!session || !currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No exam in progress</p>
        <button onClick={() => navigate('/exam')} className="btn-primary mt-4">Back to Setup</button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = session.answers.filter(a => a.selectedChoiceId !== null).length;
  const flaggedCount = session.answers.filter(a => a.isFlagged).length;

  const handleSubmit = () => {
    setShowSubmitModal(false);
    submitExam();
    navigate('/exam/results');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <span className="text-sm font-medium text-gray-600">
          {currentIndex + 1} / {session.questions.length}
        </span>
        <span className={`text-lg font-bold ${timeRemaining < 300 ? 'text-red-500 animate-pulse-fast' : 'text-gray-700'}`}>
          ⏱ {formatTime(timeRemaining)}
        </span>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="text-sm font-medium text-exam-DEFAULT hover:text-exam-dark"
        >
          Submit
        </button>
      </div>

      {/* Question */}
      <div className="card mx-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">Question {currentIndex + 1}</span>
          <button
            onClick={toggleFlag}
            className={`text-sm px-3 py-1 rounded-full border ${
              session.answers[currentIndex]?.isFlagged
                ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                : 'border-gray-200 text-gray-400'
            }`}
          >
            🚩 {session.answers[currentIndex]?.isFlagged ? 'Flagged' : 'Flag'}
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentQuestion.stem}</h3>

        <div className="space-y-2">
          {currentQuestion.choices.map(choice => {
            const isSelected = session.answers[currentIndex]?.selectedChoiceId === choice.id;
            return (
              <button
                key={choice.id}
                onClick={() => answerQuestion(choice.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">{choice.id.toUpperCase()}. </span>
                {choice.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={previousQuestion}
          disabled={currentIndex === 0}
          className="btn-secondary text-sm"
        >
          ← Previous
        </button>
        <button
          onClick={() => setShowNavigator(true)}
          className="text-sm text-primary-600 font-medium"
        >
          📋 Navigator
        </button>
        <button
          onClick={nextQuestion}
          disabled={currentIndex === session.questions.length - 1}
          className="btn-primary text-sm"
        >
          Next →
        </button>
      </div>

      {/* Stats Bar */}
      <div className="card mx-4">
        <div className="flex justify-around text-center text-sm">
          <div>
            <p className="text-green-600 font-bold">{answeredCount}</p>
            <p className="text-gray-500">Answered</p>
          </div>
          <div>
            <p className="text-gray-600 font-bold">{session.questions.length - answeredCount}</p>
            <p className="text-gray-500">Unanswered</p>
          </div>
          <div>
            <p className="text-yellow-600 font-bold">{flaggedCount}</p>
            <p className="text-gray-500">Flagged</p>
          </div>
        </div>
      </div>

      {/* Question Navigator Modal */}
      {showNavigator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-xl md:rounded-xl w-full md:max-w-lg max-h-96 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Question Navigator</h3>
              <button onClick={() => setShowNavigator(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {session.questions.map((q, i) => {
                const answer = session.answers[i];
                let className = 'p-2 rounded-lg text-center text-sm font-medium border-2 ';
                if (i === currentIndex) {
                  className += 'border-primary-500 bg-primary-50 ';
                } else if (answer?.isFlagged) {
                  className += 'border-yellow-400 bg-yellow-50 ';
                } else if (answer?.selectedChoiceId) {
                  className += 'border-green-500 bg-green-50 ';
                } else {
                  className += 'border-gray-200 ';
                }
                return (
                  <button
                    key={q.id}
                    onClick={() => { jumpToQuestion(i); setShowNavigator(false); }}
                    className={className}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="text-lg font-bold mb-2">Submit Exam?</h3>
            <p className="text-sm text-gray-600 mb-4">
              You have answered {answeredCount} of {session.questions.length} questions.
              {session.questions.length - answeredCount > 0 && (
                <span className="text-red-500 font-medium"> {session.questions.length - answeredCount} unanswered!</span>
              )}
            </p>
            <div className="space-y-2">
              <button onClick={handleSubmit} className="w-full bg-exam-DEFAULT text-white py-2 rounded-lg font-semibold">
                Yes, Submit
              </button>
              <button onClick={() => setShowSubmitModal(false)} className="w-full btn-secondary py-2">
                Continue Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
