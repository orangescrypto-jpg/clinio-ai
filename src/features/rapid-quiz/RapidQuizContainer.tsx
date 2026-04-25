import React, { useState } from 'react';
import { QuizSetup } from './components/QuizSetup';
import { QuizPlayer } from './components/QuizPlayer';
import { QuizResults } from './components/QuizResults';
import { QuizConfig, QuizQuestion } from '../../types';
import { useQuizStore } from '../../stores/useQuizStore';

type Screen = 'setup' | 'playing' | 'results';

export const RapidQuizContainer: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('setup');
  const { startQuiz, resetQuiz } = useQuizStore();

  const handleStartQuiz = (questions: QuizQuestion[], config: QuizConfig) => {
    startQuiz(questions, config);
    setScreen('playing');
  };

  const handleQuizComplete = () => {
    setScreen('results');
  };

  const handleBackToSetup = () => {
    resetQuiz();
    setScreen('setup');
  };

  const handleRetry = () => {
    resetQuiz();
    setScreen('setup');
  };

  return (
    <div>
      {screen === 'setup' && <QuizSetup onStart={handleStartQuiz} />}
      {screen === 'playing' && <QuizPlayer onComplete={handleQuizComplete} onExit={handleBackToSetup} />}
      {screen === 'results' && <QuizResults onRetry={handleRetry} onHome={handleBackToSetup} />}
    </div>
  );
};
