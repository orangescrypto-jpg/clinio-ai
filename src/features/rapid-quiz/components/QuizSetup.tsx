import React, { useState, useEffect } from 'react';
import { QuizConfig, QuizQuestion, Question } from '../../../types';
import { fetchCategories, fetchSubCategories, fetchTopics } from '../../../data/categories';
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
];

export const QuizSetup: React.FC<Props> = ({ onStart }) => {
  const [categoryId, setCategoryId] = useState<string>('');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [topicId, setTopicId] = useState<string>('');
  const [scope, setScope] = useState<'mixed' | 'category' | 'subCategory' | 'topic'>('mixed');
  const [questionCount] = useState(50);

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoryId && (scope === 'subCategory' || scope === 'topic')) {
      loadSubCategories(categoryId);
    } else {
      setSubCategories([]);
    }
  }, [categoryId, scope]);

  useEffect(() => {
    if (subCategoryId && scope === 'topic') {
      loadTopics(subCategoryId);
    } else {
      setTopics([]);
    }
  }, [subCategoryId, scope]);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  const loadSubCategories = async (catId: string) => {
    const data = await fetchSubCategories(catId);
    setSubCategories(data);
  };

  const loadTopics = async (subId: string) => {
    const data = await fetchTopics(subId);
    setTopics(data);
  };

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

  const canStart =
    scope === 'mixed' ||
    (scope === 'category' && categoryId) ||
    (scope === 'subCategory' && categoryId && subCategoryId) ||
    (scope === 'topic' && categoryId && subCategoryId && topicId);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Rapid Quiz</h2>
        <p className="text-gray-600 mt-1">Choose your practice mode</p>
      </div>

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
                scope === opt.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
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
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
        )}

        {(scope === 'subCategory' || scope === 'topic') && categoryId && subCategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System</label>
            <select
              value={subCategoryId}
              onChange={e => { setSubCategoryId(e.target.value); setTopicId(''); }}
              className="input-field"
            >
              <option value="">Select system...</option>
              {subCategories.map((sub: any) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        {scope === 'topic' && subCategoryId && topics.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <select value={topicId} onChange={e => setTopicId(e.target.value)} className="input-field">
              <option value="">Select topic...</option>
              {topics.map((topic: any) => (
                <option key={topic.id} value={topic.id}>{topic.name} ({topic.questionCount} questions)</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Questions per session</span>
          <span className="text-lg font-bold text-primary-600">{questionCount}</span>
        </div>
      </div>

      <button onClick={handleStart} disabled={!canStart} className="btn-primary w-full text-lg disabled:opacity-50">
        Start Quiz
      </button>
    </div>
  );
};
