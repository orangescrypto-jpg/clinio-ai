import React, { useState } from 'react';
import { QuizConfig, QuizQuestion, Question } from '../../../types';
import { categories, subCategories, topics, getSubCategories, getTopics } from '../../../data/categories';
import { sessionManager } from '../../../utils/sessionManager';
import { questionSelector } from '../../../utils/questionSelector';

interface Props {
  onStart: (questions: QuizQuestion[], config: QuizConfig) => void;
}

const MOCK_QUESTIONS: Question[] = [
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
    correctAnswerId: 'a',
    explanation: 'Furosemide is a loop diuretic that provides rapid relief of pulmonary congestion in acute heart failure by reducing fluid volume.',
    difficulty: 'medium',
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
    correctAnswerId: 'b',
    explanation: 'Digoxin improves cardiac output, which increases renal perfusion and reduces edema. Decreased edema is a sign of effective therapy.',
    difficulty: 'medium',
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
    correctAnswerId: 'b',
    explanation: 'ACE inhibitors like lisinopril can cause a persistent dry cough due to bradykinin accumulation. This is a common side effect.',
    difficulty: 'easy',
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
    correctAnswerId: 'b',
    explanation: 'Elevated troponin is a specific marker for myocardial injury and indicates myocardial infarction.',
    difficulty: 'easy',
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
    correctAnswerId: 'b',
    explanation: 'Atrial fibrillation shows absent P waves and an irregularly irregular ventricular rhythm on ECG.',
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

    // Use mock questions for now
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

        {/* Category Select */}
        {(scope === 'category' || scope === 'subCategory' || scope === 'topic') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
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

        {/* SubCategory Select */}
        {(scope === 'subCategory' || scope === 'topic') && categoryId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System</label>
            <select
              value={subCategoryId}
              onChange={e => {
                setSubCategoryId(e.target.value);
                setTopicId('');
              }}
              className="input-field"
            >
              <option value="">Select system...</option>
              {availableSubCategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Topic Select */}
        {scope === 'topic' && subCategoryId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
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
      </div>

      {/* Question Count Info */}
      <div className="card">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Questions per session</span>
          <span className="text-lg font-bold text-primary-600">{questionCount}</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={scope === 'category' && !categoryId || scope === 'subCategory' && !subCategoryId || scope === 'topic' && !topicId}
        className="btn-primary w-full text-lg"
      >
        Start Quiz
      </button>
    </div>
  );
};
