import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QuizConfig, QuizQuestion, Question } from '../../../types';
import { fetchCategories, fetchSubCategories, fetchTopics } from '../../../data/categories';
import { sessionManager } from '../../../utils/sessionManager';
import { questionSelector } from '../../../utils/questionSelector';

interface Props {
  onStart: (questions: QuizQuestion[], config: QuizConfig) => void;
}

const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents';

export const QuizSetup: React.FC<Props> = ({ onStart }) => {
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get('topic') || '';

  const [categoryId, setCategoryId] = useState<string>('');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [topicId, setTopicId] = useState<string>('');
  const [scope, setScope] = useState<'mixed' | 'category' | 'subCategory' | 'topic'>('mixed');
  const [questionCount] = useState(50);

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadCategories(); }, []);

  useEffect(() => {
    if (categoryId && (scope === 'subCategory' || scope === 'topic')) {
      loadSubCategories(categoryId);
    } else {
      setSubCategories([]);
      setSubCategoryId('');
    }
  }, [categoryId, scope]);

  useEffect(() => {
    if (subCategoryId && scope === 'topic') {
      loadTopics(subCategoryId);
    } else {
      setTopics([]);
      setTopicId('');
    }
  }, [subCategoryId, scope]);

  // If a topic name was passed via URL (from homepage), switch to topic scope
  useEffect(() => {
    if (topicParam && !loading) {
      setScope('topic');
      // User will need to pick category/subcategory to narrow down;
      // we surface the topicParam as a hint in the UI
    }
  }, [topicParam, loading]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch {
      setError('Failed to load categories. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSubCategories = async (catId: string) => {
    try {
      const data = await fetchSubCategories(catId);
      setSubCategories(data);
    } catch {
      console.error('Failed to load subcategories');
    }
  };

  const loadTopics = async (subId: string) => {
    try {
      const data = await fetchTopics(subId);
      setTopics(data);
    } catch {
      console.error('Failed to load topics');
    }
  };

  const fetchQuestionsFromFirebase = async (tId: string): Promise<Question[]> => {
    const response = await fetch(`${FIRESTORE_URL}/questions`);
    if (!response.ok) throw new Error('Network error fetching questions');
    const data = await response.json();
    if (!data.documents) return [];
    return data.documents
      .filter((doc: any) => {
        const f = doc.fields;
        return f.topicId?.stringValue === tId;
      })
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
          correctAnswerId: f.correctAnswerId?.stringValue || '',
          explanation: f.explanation?.stringValue || '',
          difficulty: f.difficulty?.stringValue || 'medium',
        };
      });
  };

  const handleStart = async () => {
    setError('');
    setStarting(true);

    try {
      const config: QuizConfig = {
        scope,
        scopeId: scope === 'topic' ? topicId : scope === 'subCategory' ? subCategoryId : scope === 'category' ? categoryId : undefined,
        questionCount,
      };

      let allQuestions: Question[] = [];

      if (scope === 'topic' && topicId) {
        allQuestions = await fetchQuestionsFromFirebase(topicId);
      }

      if (allQuestions.length === 0) {
        setError('No questions found for this selection. Try a different topic or check back later.');
        return;
      }

      const session = sessionManager.getSession();
      const scopeKey = sessionManager.buildScopeKey(scope, config.scopeId);

      const { selected } = questionSelector.selectQuestions(
        allQuestions,
        session,
        scopeKey,
        Math.min(questionCount, allQuestions.length)
      );

      const quizQuestions: QuizQuestion[] = selected.map(q => ({
        question: q,
        timeLimit: 60,
      }));

      onStart(quizQuestions, config);
    } catch (err) {
      setError('Something went wrong loading questions. Please try again.');
      console.error(err);
    } finally {
      setStarting(false);
    }
  };

  const canStart =
    scope === 'mixed' ||
    (scope === 'category' && categoryId) ||
    (scope === 'subCategory' && categoryId && subCategoryId) ||
    (scope === 'topic' && categoryId && subCategoryId && topicId);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mx-auto" />
        <p className="text-gray-500 mt-4">Loading categories…</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">⚡ Rapid Quiz</h2>
        <p className="text-gray-500 mt-1">Choose your practice mode and start immediately</p>
        {topicParam && (
          <div className="mt-3 text-xs bg-primary-50 border border-primary-100 text-primary-700 px-3 py-2 rounded-lg">
            Tip: Select "By Topic" and navigate to <strong>{topicParam}</strong> to start that topic's questions.
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Scope Selector */}
      <div className="card space-y-4">
        <p className="text-sm font-semibold text-gray-700">Practice Mode</p>
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
                setError('');
              }}
              className={`p-3 rounded-xl border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                scope === opt.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="text-xl block">{opt.icon}</span>
              <p className="text-sm font-medium mt-1 text-gray-800">{opt.label}</p>
            </button>
          ))}
        </div>

        {/* Category */}
        {(scope === 'category' || scope === 'subCategory' || scope === 'topic') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="quiz-category">Category</label>
            <select
              id="quiz-category"
              value={categoryId}
              onChange={e => { setCategoryId(e.target.value); setSubCategoryId(''); setTopicId(''); setError(''); }}
              className="input-field"
            >
              <option value="">Select a category…</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* SubCategory */}
        {(scope === 'subCategory' || scope === 'topic') && categoryId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="quiz-sub">System / Area</label>
            {subCategories.length > 0 ? (
              <select
                id="quiz-sub"
                value={subCategoryId}
                onChange={e => { setSubCategoryId(e.target.value); setTopicId(''); setError(''); }}
                className="input-field"
              >
                <option value="">Select a system…</option>
                {subCategories.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-400 italic">No sub-categories found for this category.</p>
            )}
          </div>
        )}

        {/* Topic */}
        {scope === 'topic' && subCategoryId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="quiz-topic">Topic</label>
            {topics.length > 0 ? (
              <select
                id="quiz-topic"
                value={topicId}
                onChange={e => { setTopicId(e.target.value); setError(''); }}
                className="input-field"
              >
                <option value="">Select a topic…</option>
                {topics.map((topic: any) => (
                  <option key={topic.id} value={topic.id}>{topic.name} ({topic.questionCount} questions)</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-400 italic">No topics found for this system.</p>
            )}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Questions per session</p>
          <p className="text-xs text-gray-400 mt-0.5">Timer: 60 seconds per question</p>
        </div>
        <span className="text-2xl font-extrabold text-primary-600">{questionCount}</span>
      </div>

      <button
        onClick={handleStart}
        disabled={!canStart || starting}
        className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {starting ? '⏳ Loading questions…' : canStart ? '⚡ Start Quiz' : 'Select options above to start'}
      </button>
    </div>
  );
};
