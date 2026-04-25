import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../features/home/HomePage';
import { RapidQuizContainer } from '../features/rapid-quiz/RapidQuizContainer';
import { ScenarioContainer } from '../features/clinical-scenario/ScenarioContainer';
import { FeedContainer } from '../features/content-feed/FeedContainer';
import { ExamSetupContainer } from '../features/exam-mode/ExamSetupContainer';
import { ExamSessionContainer } from '../features/exam-mode/ExamSessionContainer';
import { ExamResultsContainer } from '../features/exam-mode/ExamResultsContainer';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'rapid-quiz', element: <RapidQuizContainer /> },
      { path: 'scenarios', element: <ScenarioContainer /> },
      { path: 'feed', element: <FeedContainer /> },
      { path: 'exam', element: <ExamSetupContainer /> },
      { path: 'exam/session', element: <ExamSessionContainer /> },
      { path: 'exam/results', element: <ExamResultsContainer /> },
    ],
  },
]);
