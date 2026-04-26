import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { categories, getSubCategories, getTopics } from '../../data/categories';

export const QuestionEditor: React.FC = () => {
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [stem, setStem] = useState('');
  const [choices, setChoices] = useState([
    { id: 'a', text: '' },
    { id: 'b', text: '' },
    { id: 'c', text: '' },
    { id: 'd', text: '' },
  ]);
  const [correctAnswerId, setCorrectAnswerId] = useState('a');
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const availableSubCategories = categoryId ? getSubCategories(categoryId) : [];
  const availableTopics = subCategoryId ? getTopics(subCategoryId) : [];

  const handleSave = async () => {
    if (!topicId || !stem || !explanation) {
      setMessage('❌ Please fill all required fields!');
      return;
    }

    if (choices.some(c => !c.text)) {
      setMessage('❌ All choices must have text!');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'questions'), {
        topicId,
        stem,
        choices,
        correctAnswerId,
        explanation,
        difficulty,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setMessage('✅ Question saved successfully!');
      setStem('');
      setChoices([
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' },
      ]);
      setExplanation('');
    } catch (error) {
      setMessage('❌ Error saving question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Create New Question</h2>

      {/* Category Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={categoryId}
            onChange={e => { setCategoryId(e.target.value); setSubCategoryId(''); setTopicId(''); }}
            className="input-field"
          >
            <option value="">Select category...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subcategory</label>
          <select
            value={subCategoryId}
            onChange={e => { setSubCategoryId(e.target.value); setTopicId(''); }}
            className="input-field"
            disabled={!categoryId}
          >
            <option value="">Select system...</option>
            {availableSubCategories.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <select value={topicId} onChange={e => setTopicId(e.target.value)} className="input-field" disabled={!subCategoryId}>
            <option value="">Select topic...</option>
            {availableTopics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Question Stem */}
      <div>
        <label className="block text-sm font-medium mb-1">Question</label>
        <textarea
          value={stem}
          onChange={e => setStem(e.target.value)}
          className="input-field h-24"
          placeholder="Write the question here..."
        />
      </div>

      {/* Choices */}
      <div>
        <label className="block text-sm font-medium mb-2">Choices</label>
        <div className="space-y-2">
          {choices.map((choice, i) => (
            <div key={choice.id} className="flex items-center gap-3">
              <span className="font-bold text-sm w-6">{choice.id.toUpperCase()}</span>
              <input
                value={choice.text}
                onChange={e => {
                  const newChoices = [...choices];
                  newChoices[i].text = e.target.value;
                  setChoices(newChoices);
                }}
                className="input-field flex-1"
                placeholder={`Choice ${choice.id.toUpperCase()}...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Correct Answer */}
      <div>
        <label className="block text-sm font-medium mb-1">Correct Answer</label>
        <div className="flex gap-2">
          {['a', 'b', 'c', 'd'].map(letter => (
            <button
              key={letter}
              onClick={() => setCorrectAnswerId(letter)}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                correctAnswerId === letter
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium mb-1">Difficulty</label>
        <div className="flex gap-2">
          {['easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d as typeof difficulty)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                difficulty === d
                  ? d === 'easy' ? 'bg-green-500 text-white' : d === 'medium' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium mb-1">Explanation (shown after answer)</label>
        <textarea
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          className="input-field h-24"
          placeholder="Explain why this answer is correct..."
        />
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Save */}
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full text-lg">
        {saving ? 'Saving...' : '💾 Save Question'}
      </button>
    </div>
  );
};
