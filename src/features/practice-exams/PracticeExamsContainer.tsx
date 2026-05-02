import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  preview: string;
  topic: string;
  category: string;
  subCategory: string;
  readTime: string;
  createdAt: string;
  hasVideo: boolean;
  imageUrl: string;
}

const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents';

export const PracticeExamsContainer: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPracticeExams();
  }, []);

  const fetchPracticeExams = async () => {
    try {
      const response = await fetch(`${FIREBASE_URL}/posts`);
      const data = await response.json();
      if (data.documents) {
        const allPosts = data.documents.map((doc: any) => {
          const f = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            title: f.title?.stringValue || '',
            preview: f.preview?.stringValue || '',
            topic: f.topic?.stringValue || '',
            category: f.category?.stringValue || '',
            subCategory: f.subCategory?.stringValue || '',
            readTime: f.readTime?.stringValue || '',
            createdAt: f.createdAt?.stringValue || '',
            hasVideo: f.hasVideo?.booleanValue || false,
            imageUrl: f.imageUrl?.stringValue || '',
          };
        });

        const practicePosts = allPosts
          .filter(p => 
            p.topic === 'Practice Mode' || 
            p.topic === 'Practice Exam' ||
            p.subCategory === 'Practice Mode' ||
            p.title?.toLowerCase().includes('practice exam') ||
            p.title?.toLowerCase().includes('practice mode')
          )
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        setPosts(practicePosts);
      }
    } catch (err) {
      console.error('Failed to load practice exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return dateStr;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading practice exams...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📝 Practice Exams</h2>
          <p className="text-gray-500 mt-1">Self-paced practice with instant feedback and detailed rationales</p>
        </div>
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-gray-500 text-lg font-medium">No practice exams yet</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon for self-paced NCLEX and nursing practice tests!</p>
          <Link to="/feed" className="text-primary-600 hover:underline text-sm mt-4 inline-block">← Back to Clinio Room</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">📝 Practice Exams</h2>
        <p className="text-gray-500 mt-1">Self-paced practice with instant feedback and detailed rationales after each question</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map(post => (
          <Link 
            key={post.id} 
            to={`/feed/${post.id}`} 
            className="card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group border-l-4 border-l-blue-500"
          >
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.title} className="w-full h-44 object-cover" />
            ) : (
              <div className="w-full h-44 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100">Practice Mode</span>
                <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full font-medium border border-gray-100">{post.category}</span>
                {post.hasVideo && <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">🎬</span>}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.preview}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{post.readTime}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center pb-8">
        <Link to="/feed" className="text-primary-600 hover:underline text-sm">← Back to Clinio Room</Link>
      </div>
    </div>
  );
};
