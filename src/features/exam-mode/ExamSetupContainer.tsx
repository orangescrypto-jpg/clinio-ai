import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamConfig, ExamQuestion } from '../../types';
import { useExamStore } from '../../stores/useExamStore';
import { categories, subCategories, topics, getSubCategories, getTopics } from '../../data/categories';
import { sessionManager } from '../../utils/sessionManager';
import { questionSelector } from '../../utils/questionSelector';

// Mock questions (same as quiz but without correctAnswerId/explanation for exam)
const MOCK_QUESTIONS = [
  {
    id: 'q1',
    topicId: 'heart-failure',
    stem: 'A 65-year-old patient with heart failure presents with dyspnea and bilateral crackles. Which medication should the nurse administer first?',
    choices: [
      { id: 'a', text: 'Furosemide (Lasix) 40mg IV' },
      { id: 'b', text: 'Digoxin 0.25mg PO' },
      { id: 'c', text: 'Metoprolol 50mg PO' },
      { id: 'd', text: 'Aspirin 325mg PO' },
    ],
    difficulty: 'medium' as const,
  },
  {
    id: 'q2',
    topicId: 'heart-failure',
    stem: 'Which finding indicates that digoxin therapy is effective?',
    choices: [
      { id: 'a', text: 'Increased heart rate' },
      { id: 'b', text: 'Decreased edema' },
      { id: 'c', text: 'Improved appetite' },
      { id: 'd', text: 'Clear breath sounds' },
    ],
    difficulty: 'medium' as const,
  },
  {
    id: 'q3',
    topicId: 'hypertension',
    stem: 'A patient with hypertension is prescribed lisinopril. What side effect should the nurse monitor for?',
    choices: [
      { id: 'a', text: 'Hypokalemia' },
      { id: 'b', text: 'Dry cough' },
      { id: 'c', text: 'Tachycardia' },
      { id: 'd', text: 'Weight gain' },
    ],
    difficulty: 'easy' as const,
  },
  {
    id: 'q4',
    topicId: 'mi-acs',
    stem: 'A patient with chest pain has elevated troponin levels. What does this indicate?',
    choices: [
      { id: 'a', text: 'Pulmonary embolism' },
      { id: 'b', text: 'Myocardial infarction' },
      { id: 'c', text: 'Pericarditis' },
      { id: 'd', text: 'Aortic dissection' },
    ],
    difficulty: 'easy' as const,
  },
  {
    id: 'q5',
    topicId: 'arrhythmias',
    stem: 'Which ECG finding is characteristic of atrial fibrillation?',
    choices: [
      { id: 'a', text: 'Regular narrow QRS complexes' },
      { id: 'b', text: 'Absent P waves with irregular rhythm' },
      { id: 'c', text: 'Widened QRS complexes' },
      { id: 'd', text: 'ST segment elevation' },
    ],
    difficulty: 'medium' as const,
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
  const [timeLimit, setTimeLimit] = useState(60); // minutes

  const availableSubCategories = categoryId ? getSubCategories(categoryId) : [];
  const availableTopics = subCategoryId ? getTopics(subCategoryId) : [];

  const handleStart = () => {
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

    // Strip answers for exam mode - NEVER send correctAnswerId
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
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Exam Mode</h2>
        <p className="text-gray-600 mt-1">Full exam simulation with timed conditions</p>
      </div>

      {/* Scope Selection */}
      <div className="card space-y-4">
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

        {(scope === 'subCategory' || scope === 'topic') && categoryId && (
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

        {scope === 'topic' && subCategoryId && (
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
      <div className="card space-y-3">
        <label className="block text-sm font-medium text-gray-700">Time Limit</label>
        <div className="grid grid-cols-4 gap-2">
          {[30, 45, 60, 90].map(mins => (
            <button
              key={mins}
              onClick={() => setTimeLimit(mins)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                timeLimit === mins ? 'border-exam-DEFAULT bg-exam-light' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-lg font-bold">{mins}</p>
              <p className="text-xs text-gray-500">min</p>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="card space-y-3">
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

      <button
        onClick={handleStart}
        disabled={scope === 'category' && !categoryId || scope === 'subCategory' && !subCategoryId || scope === 'topic' && !topicId}
        className="w-full bg-exam-DEFAULT hover:bg-exam-dark text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all disabled:opacity-50"
      >
        Start Exam
      </button>
    </div>
  );
};
