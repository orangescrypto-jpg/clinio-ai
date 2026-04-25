import React, { useState } from 'react';
import { QuizConfig, QuizQuestion, Question } from '../../../types';
import { categories, getSubCategories, getTopics } from '../../../data/categories';
import { sessionManager } from '../../../utils/sessionManager';
import { questionSelector } from '../../../utils/questionSelector';

interface Props {
  onStart: (questions: QuizQuestion[], config: QuizConfig) => void;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    topicId: 'topic-vital-signs',
    stem: 'What is the normal resting blood pressure for a healthy adult?',
    choices: [
      { id: 'a', text: '120/80 mmHg' },
      { id: 'b', text: '140/90 mmHg' },
      { id: 'c', text: '100/60 mmHg' },
      { id: 'd', text: '160/100 mmHg' },
    ],
    correctAnswerId: 'a',
    explanation: 'Normal blood pressure is 120/80 mmHg. Values above 140/90 indicate hypertension.',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    topicId: 'topic-vital-signs',
    stem: 'Which vital sign is most sensitive to infection?',
    choices: [
      { id: 'a', text: 'Blood pressure' },
      { id: 'b', text: 'Temperature' },
      { id: 'c', text: 'Respiratory rate' },
      { id: 'd', text: 'Oxygen saturation' },
    ],
    correctAnswerId: 'b',
    explanation: 'Temperature elevation (fever) is often the first sign of infection.',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    topicId: 'topic-heart-failure',
    stem: 'A patient with heart failure has bilateral crackles. Which medication should be given first?',
    choices: [
      { id: 'a', text: 'Furosemide IV' },
      { id: 'b', text: 'Digoxin PO' },
      { id: 'c', text: 'Metoprolol PO' },
      { id: 'd', text: 'Aspirin PO' },
    ],
    correctAnswerId: 'a',
    explanation: 'Furosemide provides rapid relief of pulmonary congestion in acute heart failure.',
    difficulty: 'medium',
  },
];

export const QuizSetup: React.FC<Props> = ({ onStart }) => {
  const [categoryId, setCategoryId] = useState<string>('');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [topicId, setTopicId] = useState<string>('');
  const [scope, setScope] = useState<'mixed' | 'category' | 'subCategory' | 'topic'>('mixed');
  const [questionCount] = useState(50);

  const availableSubCategories = categoryId ? getSubCategories(categoryId) : [];
  const availableTopics = subCategoryId ? getTopics(subCategoryId) : [];

  const handleStart = () => {
    const config: QuizConfig = {
      scope,
      scopeId: scope === 'topic' ? topicId : scope === 'subCategory' ? subCategoryId : scope === 'category' ? categoryId : undefined,
      questionCount,
    };

    const session = sessionManager.getSession();
    const scopeKey = sessionManager.buildScopeKey(scope, config.scopeId);

    const { selected } = questionSelector.selectQuestions(
      MOCK_QUESTIONS,
      session,
      scopeKey,
      Math.min(questionCount, MOCK_QUESTIONS.length)
    );

    const quizQuestions: QuizQuestion[] = selected.map(q => ({
      question: q,
      timeLimit: 10,
    }));

    onStart(quizQuestions, config);
  };

  // Check if we can start
  const canStart = 
    scope === 'mixed' ||
    (scope === 'category' && categoryId) ||
    (scope === 'subCategory' && categoryId && subCategoryId) ||
    (scope === 'topic' && categoryId && subCategoryId && topicId);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Rapid Quiz</h2>
        <p className="text-gray-600 mt-1">Choose your practice mode</p>
      </div>

      {/* Scope Selection */}
      <div className="card space-y-4">
        <label className="block text-sm font-medium text-gray-700">Practice Mode</label>
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
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{opt.icon}</span>
              <p className="text-sm font-medium mt-1">{opt.label}</p>
            </button>
          ))}
        </div>

        {/* Step 1: Category Selection */}
        {(scope === 'category' || scope === 'subCategory' || scope === 'topic') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={e => {
                setCategoryId(e.target.value);
                setSubCategoryId('');
                setTopicId('');
              }}
              className="input-field"
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Step 2: SubCategory Selection - Only shows if category selected */}
        {(scope === 'subCategory' || scope === 'topic') && categoryId && availableSubCategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              value={subCategoryId}
              onChange={e => {
                setSubCategoryId(e.target.value);
                setTopicId('');
              }}
              className="input-field"
            >
              <option value="">Select subcategory...</option>
              {availableSubCategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Step 3: Topic Selection - Only shows if subcategory selected AND topics exist */}
        {scope === 'topic' && subCategoryId && availableTopics.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <select
              value={topicId}
              onChange={e => setTopicId(e.target.value)}
              className="input-field"
            >
              <option value="">Select topic...</option>
              {availableTopics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name} ({topic.questionCount} questions)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* If no topics exist for selected subcategory, don't show empty state */}
        {scope === 'topic' && subCategoryId && availableTopics.length === 0 && (
          <p className="text-sm text-gray-400 italic">No topics available for this subcategory yet.</p>
        )}
      </div>

      {/* Question Count */}
      <div className="card">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Questions per session</span>
          <span className="text-lg font-bold text-primary-600">{questionCount}</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={!canStart}
        className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Quiz
      </button>
    </div>
  );
};
