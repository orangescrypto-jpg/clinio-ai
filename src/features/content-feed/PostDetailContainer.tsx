import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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
  relatedQuiz: string;
  likes: number;
  comments: number;
  createdAt: string;
}

interface Comment {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  postId: string;
}

export const PostDetailContainer: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    { id: 'c1', name: 'NursingStudent', message: 'Great explanation! Very helpful for my studies.', timestamp: '2026-04-25', postId: '' },
    { id: 'c2', name: 'MedLearner', message: 'Can you add more practice questions on this topic?', timestamp: '2026-04-24', postId: '' },
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents/posts/${postId}`
      );
      
      if (!response.ok) {
        setPost(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const f = data.fields;
      
      setPost({
        id: postId!,
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
        relatedQuiz: f.relatedQuiz?.stringValue || '',
        likes: f.likes?.integerValue || 0,
        comments: f.comments?.integerValue || 0,
        createdAt: f.createdAt?.stringValue || '',
      });
    } catch (err) {
      console.error('Failed to load post:', err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    const comment: Comment = {
      id: 'c' + Date.now(),
      name: newName.trim(),
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      postId: postId || '',
    };

    setComments([comment, ...comments]);
    setNewName('');
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-4xl mb-4">📝</p>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Post Not Found</h3>
        <p className="text-gray-500 mb-4">The post you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/feed')} className="btn-secondary">← Back to Clinio Room</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={() => navigate('/feed')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        ← Back to Clinio Room
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">{post.topic}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{post.category}</span>
          {post.hasVideo && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">🎬 Video</span>}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <div className="text-sm text-gray-400">
          {post.category}{post.subCategory ? ` · ${post.subCategory}` : ''} · {post.readTime} · {post.createdAt}
        </div>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="card overflow-hidden">
          <img src={post.imageUrl} alt={post.title} className="w-full max-h-96 object-cover rounded-lg" />
        </div>
      )}

      {/* Video */}
      {post.hasVideo && post.videoUrl && (
        <div className="card overflow-hidden">
          <div className="aspect-video">
            <iframe src={post.videoUrl} title="Video lesson" className="w-full h-full" allowFullScreen />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="card">
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>

      {/* Related Quiz */}
      {post.relatedQuiz && (
        <Link to={`/rapid-quiz?topic=${encodeURIComponent(post.relatedQuiz)}`} className="card border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 transition-colors flex items-center justify-between p-5">
          <div>
            <p className="font-semibold text-primary-700">📝 Try Related Quiz</p>
            <p className="text-sm text-primary-500">Test your knowledge on {post.relatedQuiz}</p>
          </div>
          <span className="text-primary-600 text-xl">→</span>
        </Link>
      )}

      {/* Comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">💬 Comments ({comments.length})</h3>

        <form onSubmit={handleAddComment} className="card p-4 space-y-3">
          <input type="text" placeholder="Your name" value={newName} onChange={e => setNewName(e.target.value)} className="input-field text-sm" required />
          <textarea placeholder="Write a comment..." value={newMessage} onChange={e => setNewMessage(e.target.value)} className="input-field text-sm" rows={3} required />
          <button type="submit" className="btn-primary text-sm">Post Comment</button>
        </form>

        {comments.map(comment => (
          <div key={comment.id} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 text-sm">{comment.name}</span>
              <span className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-700">{comment.message}</p>
          </div>
        ))}
      </div>

      <div className="pb-8" />
    </div>
  );
};
