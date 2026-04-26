import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamConfig, ExamQuestion } from '../../types';
import { useExamStore } from '../../stores/useExamStore';
import { fetchCategories, fetchSubCategories, fetchTopics } from '../../data/categories';
import { sessionManager } from '../../utils/sessionManager';
import { questionSelector } from '../../utils/questionSelector';

const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents';

export const ExamSetupContainer: React.FC = () => {
  const navigate = useNavigate();
  const { startExam } = useExamStore();

  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [scope, setScope] = useState<'mixed' | 'category' | 'subCategory' | 'topic'>('mixed');
  const [questionCount] = useState(50);
  const [timeLimit, setTimeLimit] = useState(60);

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => {
    if (categoryId && (scope === 'subCategory' || scope === 'topic')) {
      loadSubCategories(categoryId);
    } else { setSubCategories([]); }
  }, [categoryId, scope]);
  useEffect(() => {
    if (subCategoryId && scope === 'topic') {
      loadTopics(subCategoryId);
    } else { setTopics([]); }
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

  const fetchQuestionsFromFirebase = async (tId: string): Promise<any[]> => {
    try {
      const response = await fetch(`${FIRESTORE_URL}/questions`);
      const data = await response.json();
      if (data.documents) {
        return data.documents
          .filter((doc: any) => doc.fields.topicId?.stringValue === tId)
          .map((doc: any) => {
            const f = doc.fields;
            return {
              id: doc.name.split('/').pop(),
              topicId: f.topicId?.stringValue || '',
              stem: f.stem?.stringValue || '',
              choices: f.choices?.arrayValue?.values?.map((v: any) => ({
                id: v.mapValue?.fields?.id?.stringValue || '',
                text: v.mapValue?.fields?.text?.stringValue || '',
              })) || [],
              difficulty: f.difficulty?.stringValue || 'medium',
            };
          });
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
    return [];
  };

  const canStart =
    scope === 'mixed' ||
    (scope === 'category' && categoryId) ||
    (scope === 'subCategory' && categoryId && subCategoryId) ||
    (scope === 'topic' && categoryId && subCategoryId && topicId);

  const handleStart = async () => {
    if (!canStart) return;
    setStarting(true);

    const config: ExamConfig = {
      scope,
      scopeId: scope === 'topic' ? topicId : scope === 'subCategory' ? subCategoryId : scope === 'category' ? categoryId : undefined,
      questionCount,
      timeLimitMinutes: timeLimit,
    };

    let allQuestions: any[] = [];

    if (scope === 'topic' && topicId) {
      allQuestions = await fetchQuestionsFromFirebase(topicId);
    }

    if (allQuestions.length === 0) {
      alert('No questions found for this topic. Please add questions in Firebase first.');
      setStarting(false);
      return;
    }

    const session = sessionManager.getSession();
    const scopeKey = sessionManager.buildScopeKey(scope, config.scopeId);

    const { selected } = questionSelector.selectQuestions(
      allQuestions as any,
      session,
      scopeKey,
      Math.min(questionCount, allQuestions.length)
    );

    // Strip answers for exam - NEVER send correctAnswerId
    const examQuestions: ExamQuestion[] = selected.map((q, i) => ({
      id: q.id,
      topicId: q.topicId,
      stem: q.stem,
      choices: q.choices,
      orderIndex: i + 1,
    }));

    startExam(examQuestions, config);
    navigate('/exam/session');
    setStarting(false);
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-24 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Exam Mode</h2>
        <p className="text-gray-600 mt-1">Full exam simulation with timed conditions</p>
      </div>

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
                scope === opt.value ? 'border-exam-DEFAULT bg-exam-light' : 'border-gray-200 hover:border-gray-300'
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
                <option key={topic.id} value={topic.id}>{topic.name} ({topic.questionCount} qs)</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="card space-y-3">
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
        disabled={!canStart || starting}
        className={`w-full text-white px-6 py-4 rounded-xl font-bold text-lg transition-all sticky bottom-20 md:bottom-4 ${
          canStart ? 'bg-red-500 hover:bg-red-600 shadow-lg' : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {starting ? '⏳ Loading questions...' : canStart ? '🚀 Start Exam' : '👆 Select options above to start'}
      </button>
    </div>
  );
};
