import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLogin } from './AdminLogin';
import { PostEditor } from './PostEditor';
import { QuestionEditor } from './QuestionEditor';

export const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<'posts' | 'questions'>('posts');

  useEffect(() => {
    if (localStorage.getItem('clinio_admin') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clinio_admin');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-lg font-bold text-primary-600">⚙️ Admin Panel</h1>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('posts')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === 'posts' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            📝 Posts
          </button>
          <button
            onClick={() => setTab('questions')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === 'questions' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            ❓ Questions
          </button>
        </div>

        {tab === 'posts' ? <PostEditor /> : <QuestionEditor />}
      </div>
    </div>
  );
};
