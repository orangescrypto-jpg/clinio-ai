import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../../../stores/useQuizStore';

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

export const QuizPlayer: React.FC<Props> = ({ onComplete, onExit }) => {
  const { session, currentQuestion, currentIndex, showFeedback, answerQuestion, nextQuestion } = useQuizStore();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [timer, setTimer] = useState(10);

  // Reset when question changes
  useEffect(() => {
    setSelectedChoice(null);
    setTimer(currentQuestion?.timeLimit || 10);
  }, [currentIndex, currentQuestion]);

  // Timer countdown
  useEffect(() => {
    if (showFeedback) return;
    if (timer <= 0) {
      handleAnswer('');
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, showFeedback]);

  const handleAnswer = (choiceId: string) => {
    if (showFeedback) return;
    setSelectedChoice(choiceId);
    answerQuestion(choiceId);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= (session?.questions.length || 0)) {
      onComplete();
    } else {
      nextQuestion();
    }
  };

  if (!session || !currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No questions available</p>
        <button onClick={onExit} className="btn-primary mt-4">Back to Setup</button>
      </div>
    );
  }

  const question = currentQuestion.question;
  const currentAnswer = session.answers[currentIndex];
  const isCorrect = currentAnswer?.isCorrect;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm text-gray-500 hover:text-gray-700">
          ✕ Exit
        </button>
        <span className="text-sm font-medium text-gray-600">
          {currentIndex + 1} / {session.questions.length}
        </span>
        <span className={`text-sm font-bold ${timer <= 3 ? 'text-red-500 animate-pulse-fast' : 'text-gray-600'}`}>
          ⏱ {timer}s
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / session.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card">
        <p className="text-xs text-gray-400 mb-2">{question.topicId.replace('-', ' ')}</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{question.stem}</h3>

        {/* Choices */}
        <div className="space-y-2">
          {question.choices.map(choice => {
            let className = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
            
            if (showFeedback) {
              if (choice.id === question.correctAnswerId) {
                className += 'border-green-500 bg-green-50 ';
              } else if (choice.id === selectedChoice && !isCorrect) {
                className += 'border-red-500 bg-red-50 ';
              } else {
                className += 'border-gray-200 opacity-60 ';
              }
            } else if (choice.id === selectedChoice) {
              className += 'border-primary-500 bg-primary-50 ';
            } else {
              className += 'border-gray-200 hover:border-gray-300 ';
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleAnswer(choice.id)}
                disabled={showFeedback}
                className={className}
              >
                <span className="font-medium">{choice.id.toUpperCase()}. </span>
                {choice.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`card border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <p className={`font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-sm text-gray-700">{question.explanation}</p>
          <button onClick={handleNext} className="btn-primary w-full mt-4">
            {currentIndex + 1 >= session.questions.length ? 'View Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};
