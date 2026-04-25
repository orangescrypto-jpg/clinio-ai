import { create } from 'zustand';
import { ExamConfig, ExamQuestion, ExamAnswer, ExamSession } from '../types';

interface ExamState {
  session: ExamSession | null;
  config: ExamConfig | null;
  currentQuestion: ExamQuestion | null;
  timeRemaining: number;
  isSubmitted: boolean;
  isComplete: boolean;

  startExam: (questions: ExamQuestion[], config: ExamConfig) => void;
  answerQuestion: (choiceId: string) => void;
  toggleFlag: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  submitExam: () => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  session: null,
  config: null,
  currentQuestion: null,
  timeRemaining: 0,
  isSubmitted: false,
  isComplete: false,

  startExam: (questions, config) => {
    const answers: ExamAnswer[] = questions.map(q => ({
      questionId: q.id,
      selectedChoiceId: null,
      isFlagged: false,
    }));

    const session: ExamSession = {
      id: 'exam_' + Date.now(),
      config,
      questions,
      answers,
      currentIndex: 0,
      timeRemainingSeconds: config.timeLimitMinutes * 60,
      status: 'in-progress',
      startedAt: new Date().toISOString(),
    };

    set({
      session,
      config,
      currentQuestion: questions[0],
      timeRemaining: config.timeLimitMinutes * 60,
      isSubmitted: false,
      isComplete: false,
    });

    // Start timer
    const timer = setInterval(() => {
      const { timeRemaining, submitExam } = get();
      if (timeRemaining <= 1) {
        clearInterval(timer);
        submitExam();
      } else {
        set({ timeRemaining: timeRemaining - 1 });
      }
    }, 1000);
  },

  answerQuestion: (choiceId) => {
    const { session } = get();
    if (!session) return;

    const answers = [...session.answers];
    answers[session.currentIndex] = {
      ...answers[session.currentIndex],
      selectedChoiceId: choiceId,
    };

    set({ session: { ...session, answers } });
  },

  toggleFlag: () => {
    const { session } = get();
    if (!session) return;

    const answers = [...session.answers];
    answers[session.currentIndex] = {
      ...answers[session.currentIndex],
      isFlagged: !answers[session.currentIndex].isFlagged,
    };

    set({ session: { ...session, answers } });
  },

  nextQuestion: () => {
    const { session } = get();
    if (!session) return;
    const next = session.currentIndex + 1;
    if (next < session.questions.length) {
      set({
        currentQuestion: session.questions[next],
        session: { ...session, currentIndex: next },
      });
    }
  },

  previousQuestion: () => {
    const { session } = get();
    if (!session) return;
    const prev = session.currentIndex - 1;
    if (prev >= 0) {
      set({
        currentQuestion: session.questions[prev],
        session: { ...session, currentIndex: prev },
      });
    }
  },

  jumpToQuestion: (index) => {
    const { session } = get();
    if (!session || index < 0 || index >= session.questions.length) return;
    set({
      currentQuestion: session.questions[index],
      session: { ...session, currentIndex: index },
    });
  },

  submitExam: () => {
    set({ isSubmitted: true, isComplete: true });
  },

  resetExam: () => {
    set({
      session: null,
      config: null,
      currentQuestion: null,
      timeRemaining: 0,
      isSubmitted: false,
      isComplete: false,
    });
  },
}));
