import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  preview: string;
  content: string;
  imageUrl: string;
  topic: string;
  category: string;
  subCategory: string;
  author: string;
  readTime: string;
  hasVideo: boolean;
  videoUrl: string;
  likes: number;
  comments: number;
  createdAt: string;
}

const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents';

export const FeedContainer: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${FIRESTORE_URL}/posts`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      if (data.documents) {
        const allPosts: Post[] = data.documents.map((doc: any) => {
          const f = doc.fields;
          return {
            id: doc.name.split('/').pop() as string,
            title: f.title?.stringValue || '',
            preview: f.preview?.stringValue || '',
            content: f.content?.stringValue || '',
            imageUrl: f.imageUrl?.stringValue || '',
            topic: f.topic?.stringValue || '',
            category: f.category?.stringValue || '',
            subCategory: f.subCategory?.stringValue || '',
            author: f.author?.stringValue || 'Clinio AI',
            readTime: f.readTime?.stringValue || '',
            hasVideo: f.hasVideo?.booleanValue || false,
            videoUrl: f.videoUrl?.stringValue || '',
            likes: Number(f.likes?.integerValue) || 0,
            comments: Number(f.comments?.integerValue) || 0,
            createdAt: f.createdAt?.stringValue || '',
          };
        });

        const generalPosts = allPosts
          .filter(
            (p) =>
              p.topic !== 'Practice Mode' &&
              p.topic !== 'Practice Exam' &&
              p.subCategory !== 'OSCE' &&
              p.subCategory !== 'Clinical Scenario' &&
              p.topic !== 'Clinical Scenario',
          )
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        setPosts(generalPosts);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Please check your connection and try again.');
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
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl text-sm flex flex-col items-center gap-3 text-center">
          <span className="text-3xl">⚠️</span>
          <p className="font-medium">{error}</p>
          <button
            onClick={() => { setError(''); setLoading(true); fetchPosts(); }}
            className="mt-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">📚 Clinio Room</h2>
        <p className="text-gray-500 mt-1">Educational content for nursing and medical students</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-gray-500">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/feed/${post.id}`}
              className="card p-5 block hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                  {post.topic}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {post.category}
                </span>
                {post.hasVideo && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    🎬 Video
                  </span>
                )}
              </div>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.preview}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  {post.readTime} · {formatDate(post.createdAt)}
                </span>
                <div className="flex items-center gap-3">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
