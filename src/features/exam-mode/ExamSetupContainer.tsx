import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamConfig, ExamQuestion } from '../../types';
import { useExamStore } from '../../stores/useExamStore';
import { categories, getSubCategories, getTopics } from '../../data/categories';
import { sessionManager } from '../../utils/sessionManager';
import { questionSelector } from '../../utils/questionSelector';

const MOCK_QUESTIONS = [
  {
    id: 'q1',
    topicId: 'topic-nursing-process',
    stem: 'What is the first step of the nursing process?',
    choices: [
      { id: 'a', text: 'Planning' },
      { id: 'b', text: 'Assessment' },
      { id: 'c', text: 'Implementation' },
      { id: 'd', text: 'Evaluation' },
    ],
    difficulty: 'easy' as const,
  },
  {
    id: 'q2',
    topicId: 'topic-nursing-process',
    stem: 'During which phase does the nurse set priorities and write goals?',
    choices: [
      { id: 'a', text: 'Assessment' },
      { id: 'b', text: 'Diagnosis' },
      { id: 'c', text: 'Planning' },
      { id: 'd', text: 'Evaluation' },
    ],
    difficulty: 'medium' as const,
  },
  {
    id: 'q3',
    topicId: 'topic-nursing-process',
    stem: 'Which of the following is an example of a nursing intervention?',
    choices: [
      { id: 'a', text: 'Diagnosing pneumonia' },
      { id: 'b', text: 'Prescribing antibiotics' },
      { id: 'c', text: 'Administering oxygen' },
      { id: 'd', text: 'Ordering an X-ray' },
    ],
    difficulty: 'medium' as const,
  },
  {
    id: 'q4',
    topicId: 'topic-nursing-process',
    stem: 'Evaluation in the nursing process involves:',
    choices: [
      { id: 'a', text: 'Collecting initial data' },
      { id: 'b', text: 'Determining if goals were met' },
      { id: 'c', text: 'Writing nursing orders' },
      { id: 'd', text: 'Performing interventions' },
    ],
    difficulty: 'easy' as const,
  },
  {
    id: 'q5',
    topicId: 'topic-nursing-process',
    stem: 'A nursing diagnosis is made during which step?',
    choices: [
      { id: 'a', text: 'Assessment' },
      { id: 'b', text: 'Diagnosis' },
      { id: 'c', text: 'Planning' },
      { id: 'd', text: 'Implementation' },
    ],
    difficulty: 'easy' as const,
  },
];

export const ExamSetupContainer: React.FC = () => {
  const navigate = useNavigate();
  const { startExam } = useExamStore();

  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [scope, setScope] = useState<'mixed' | 'category' | 'subCategory' | 'topic'>('mixed');
  const [questionCount] = useState(50);
  const [timeLimit, setTimeLimit] = useState(60);

  const availableSubCategories = categoryId ? getSubCategories(categoryId) : [];
  const availableTopics = subCategoryId ? getTopics(subCategoryId) : [];

  const canStart =
    scope === 'mixed' ||
    (scope === 'category' && categoryId !== '') ||
    (scope === 'subCategory' && categoryId !== '' && subCategoryId !== '') ||
    (scope === 'topic' && categoryId !== '' && subCategoryId !== '' && topicId !== '');

  const handleStart = () => {
    if (!canStart) return;

    const config: ExamConfig = {
      scope,
      scopeId: scope === 'topic' ? topicId : scope === 'subCategory' ? subCategoryId : scope === 'category' ? categoryId : undefined,
      questionCount,
      timeLimitMinutes: timeLimit,
    };

    const session = sessionManager.getSession();
    const scopeKey = sessionManager.buildScopeKey(scope, config.scopeId);

    const { selected } = questionSelector.selectQuestions(
      MOCK_QUESTIONS as any,
      session,
      scopeKey,
      Math.min(questionCount, MOCK_QUESTIONS.length)
    );

    const examQuestions: ExamQuestion[] = selected.map((q, i) => ({
      id: q.id,
      topicId: q.topicId,
      stem: q.stem,
      choices: q.choices,
      orderIndex: i + 1,
    }));

    startExam(examQuestions, config);
    navigate('/exam/session');
  };

  return (
    <div className="max-w-lg mx-auto pb-24">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Exam Mode</h2>
        <p className="text-gray-600 mt-1">Full exam simulation with timed conditions</p>
      </div>

      {/* Scope Selection */}
      <div className="card space-y-4 mb-4">
        <label className="block text-sm font-medium text-gray-700">Exam Scope</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'mixed', label: 'All Categories', icon: '🎯' },
            { value: 'category', label: 'By Category', icon: '📂' },
            { value: 'subCategory', label: 'By System', icon: '🔬' },
            { value: 'topic', label: 'By Topic', icon: '📝' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                setScope(opt.value as typeof scope);
                setCategoryId('');
                setSubCategoryId('');
                setTopicId('');
              }}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                scope === opt.value
                  ? 'border-exam-DEFAULT bg-exam-light'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{opt.icon}</span>
              <p className="text-sm font-medium mt-1">{opt.label}</p>
            </button>
          ))}
        </div>

        {(scope === 'category' || scope === 'subCategory' || scope === 'topic') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryId}
              onChange={e => { setCategoryId(e.target.value); setSubCategoryId(''); setTopicId(''); }}
              className="input-field"
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
        )}

        {(scope === 'subCategory' || scope === 'topic') && categoryId && availableSubCategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System</label>
            <select
              value={subCategoryId}
              onChange={e => { setSubCategoryId(e.target.value); setTopicId(''); }}
              className="input-field"
            >
              <option value="">Select system...</option>
              {availableSubCategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        {scope === 'topic' && subCategoryId && availableTopics.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <select value={topicId} onChange={e => setTopicId(e.target.value)} className="input-field">
              <option value="">Select topic...</option>
              {availableTopics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.name} ({topic.questionCount} qs)</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Time Limit */}
      <div className="card space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-700">Time Limit</label>
        <div className="grid grid-cols-4 gap-2">
          {[30, 45, 60, 90].map(mins => (
            <button
              key={mins}
              onClick={() => setTimeLimit(mins)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                timeLimit === mins ? 'border-exam-DEFAULT bg-exam-light font-bold' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-lg font-bold">{mins}</p>
              <p className="text-xs text-gray-500">min</p>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="card space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Questions</span>
          <span className="font-semibold">{questionCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Time Limit</span>
          <span className="font-semibold">{timeLimit} minutes</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Feedback</span>
          <span className="text-sm text-exam-dark font-medium">After submission only</span>
        </div>
      </div>

      {/* START EXAM BUTTON - BIG & VISIBLE */}
      <button
        onClick={handleStart}
        disabled={!canStart}
        className={`w-full text-white px-6 py-4 rounded-xl font-bold text-lg transition-all sticky bottom-20 md:bottom-4 ${
          canStart
            ? 'bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl active:scale-95'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {canStart ? '🚀 Start Exam' : '👆 Select options above to start'}
      </button>
    </div>
  );
};
