import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../features/home/HomePage';
import { RapidQuizContainer } from '../features/rapid-quiz/RapidQuizContainer';
import { ScenarioContainer } from '../features/clinical-scenario/ScenarioContainer';
import { ScenarioPlayerContainer } from '../features/clinical-scenario/ScenarioPlayerContainer';
import { FeedContainer } from '../features/content-feed/FeedContainer';
import { PostDetailContainer } from '../features/content-feed/PostDetailContainer';
import { ExamSetupContainer } from '../features/exam-mode/ExamSetupContainer';
import { ExamSessionContainer } from '../features/exam-mode/ExamSessionContainer';
import { ExamResultsContainer } from '../features/exam-mode/ExamResultsContainer';
import { AboutPage } from '../features/pages/AboutPage';
import { ContactPage } from '../features/pages/ContactPage';
import { PrivacyPage } from '../features/pages/PrivacyPage';
import { TermsPage } from '../features/pages/TermsPage';
import { DisclaimerPage } from '../features/pages/DisclaimerPage';
import { PracticeExamsContainer } from '../features/practice-exams/PracticeExamsContainer';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'rapid-quiz', element: <RapidQuizContainer /> },
      { path: 'scenarios', element: <ScenarioContainer /> },
      { path: 'scenarios/:scenarioId', element: <ScenarioPlayerContainer /> },
      { path: 'practice-exams', element: <PracticeExamsContainer /> },
      { path: 'feed', element: <FeedContainer /> },
      { path: 'feed/:postId', element: <PostDetailContainer /> },
      { path: 'exam', element: <ExamSetupContainer /> },
      { path: 'exam/session', element: <ExamSessionContainer /> },
      { path: 'exam/results', element: <ExamResultsContainer /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'disclaimer', element: <DisclaimerPage /> },
    ],
  },
]);
