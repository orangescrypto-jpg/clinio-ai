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

export const FeedContainer: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch from Firestore REST API
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents/posts?orderBy=createdAt desc`
      );
      const data = await response.json();
      
      if (data.documents) {
        const fetchedPosts = data.documents.map((doc: any) => {
          const fields = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            title: fields.title?.stringValue || '',
            preview: fields.preview?.stringValue || '',
            content: fields.content?.stringValue || '',
            imageUrl: fields.imageUrl?.stringValue || '',
            topic: fields.topic?.stringValue || '',
            category: fields.category?.stringValue || '',
            subCategory: fields.subCategory?.stringValue || '',
            author: fields.author?.stringValue || 'Clinio AI',
            readTime: fields.readTime?.stringValue || '',
            hasVideo: fields.hasVideo?.booleanValue || false,
            videoUrl: fields.videoUrl?.stringValue || '',
            likes: fields.likes?.integerValue || 0,
            comments: fields.comments?.integerValue || 0,
            createdAt: fields.createdAt?.stringValue || '',
          };
        });
        setPosts(fetchedPosts);
      }
    } catch (err) {
      setError('Failed to load posts. Make sure Firestore rules allow public access.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-red-500">{error}</p>
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
          {posts.map(post => (
            <Link key={post.id} to={`/feed/${post.id}`} className="card p-5 block hover:shadow-md transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">{post.topic}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{post.category}</span>
                {post.hasVideo && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">🎬 Video</span>}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{post.title}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.preview}</p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover rounded-lg mb-3" />
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{post.readTime}</span>
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
