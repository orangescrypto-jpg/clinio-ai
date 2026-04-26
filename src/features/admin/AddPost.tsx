import React, { useState } from 'react';
import { db } from '../../api/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const AddPost: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    preview: '',
    content: '',
    topic: '',
    category: '',
    subCategory: '',
    readTime: '5 min read',
    hasVideo: false,
    videoUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await addDoc(collection(db, 'posts'), {
        ...form,
        author: 'Clinio AI',
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSuccess(true);
      setTimeout(() => navigate('/feed'), 1500);
    } catch (error) {
      alert('Error saving post');
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-4xl mb-4">✅</p>
        <h3 className="text-xl font-bold text-green-600">Post Published!</h3>
        <p className="text-gray-500 mt-2">Redirecting to Clinio Room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">📝 Add New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="input-field"
            placeholder="Post title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preview (short summary)</label>
          <textarea
            required
            value={form.preview}
            onChange={e => setForm({ ...form, preview: e.target.value })}
            className="input-field"
            rows={2}
            placeholder="Brief preview for homepage..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Content</label>
          <textarea
            required
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="input-field"
            rows={8}
            placeholder="Write full article here..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="input-field"
            >
              <option value="">Select...</option>
              <option value="Clinical Medicine">Clinical Medicine</option>
              <option value="NCLEX">NCLEX</option>
              <option value="NMCN">NMCN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <input
              type="text"
              value={form.topic}
              onChange={e => setForm({ ...form, topic: e.target.value })}
              className="input-field"
              placeholder="e.g. Cardiovascular"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasVideo}
              onChange={e => setForm({ ...form, hasVideo: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">Has YouTube video</span>
          </label>
        </div>

        {form.hasVideo && (
          <div>
            <label className="block text-sm font-medium mb-1">YouTube Video URL</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={e => setForm({ ...form, videoUrl: e.target.value })}
              className="input-field"
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full"
        >
          {saving ? 'Publishing...' : '📢 Publish Post'}
        </button>
      </form>
    </div>
  );
};
