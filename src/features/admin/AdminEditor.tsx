import React, { useState, useEffect } from 'react';
import { db } from '../../api/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Post {
  id?: string;
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
  updatedAt: string;
}

export const AdminEditor: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  
  const [form, setForm] = useState<Post>({
    title: '',
    preview: '',
    content: '',
    imageUrl: '',
    topic: 'Cardiovascular',
    category: 'Clinical Medicine',
    subCategory: 'Cardiology',
    author: 'Clinio AI',
    readTime: '5 min read',
    hasVideo: false,
    videoUrl: '',
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    setPosts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'posts', editingId), { ...form, updatedAt: new Date().toISOString().split('T')[0] });
        setMessage('✅ Post updated!');
      } else {
        await addDoc(collection(db, 'posts'), form);
        setMessage('✅ Post published!');
      }
      setEditingId(null);
      setForm({
        title: '', preview: '', content: '', imageUrl: '',
        topic: 'Cardiovascular', category: 'Clinical Medicine', subCategory: 'Cardiology',
        author: 'Clinio AI', readTime: '5 min read', hasVideo: false, videoUrl: '',
        likes: 0, comments: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      });
      loadPosts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error saving post');
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id!);
    setForm(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Delete this post?')) {
      await deleteDoc(doc(db, 'posts', postId));
      loadPosts();
      setMessage('🗑️ Post deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <h2 className="text-3xl font-bold">🛠️ Admin Editor</h2>
      
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h3 className="text-xl font-semibold">
          {editingId ? '✏️ Edit Post' : '📝 New Post'}
        </h3>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preview (short summary for cards)</label>
          <textarea
            value={form.preview}
            onChange={e => setForm({ ...form, preview: e.target.value })}
            className="input-field"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content (Markdown supported)</label>
          <textarea
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="input-field font-mono text-sm"
            rows={12}
            required
            placeholder="## Heading&#10;&#10;**Bold text**&#10;&#10;- List item&#10;&#10;![Image description](image-url)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL (upload to <a href="https://imgbb.com" target="_blank" className="text-primary-600 underline">imgbb.com</a> and paste link)
          </label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            className="input-field"
            placeholder="https://i.ibb.co/example.jpg"
          />
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="mt-2 max-h-40 rounded-lg" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
              <option>Clinical Medicine</option>
              <option>NCLEX</option>
              <option>NMCN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <input
              type="text"
              value={form.topic}
              onChange={e => setForm({ ...form, topic: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">SubCategory</label>
            <input
              type="text"
              value={form.subCategory}
              onChange={e => setForm({ ...form, subCategory: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Read Time</label>
            <input
              type="text"
              value={form.readTime}
              onChange={e => setForm({ ...form, readTime: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.hasVideo}
              onChange={e => setForm({ ...form, hasVideo: e.target.checked })}
            />
            <span className="text-sm">Has Video</span>
          </label>
          {form.hasVideo && (
            <input
              type="url"
              value={form.videoUrl}
              onChange={e => setForm({ ...form, videoUrl: e.target.value })}
              className="input-field flex-1"
              placeholder="YouTube embed URL"
            />
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">
            {editingId ? '💾 Update Post' : '🚀 Publish Post'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  title: '', preview: '', content: '', imageUrl: '',
                  topic: 'Cardiovascular', category: 'Clinical Medicine', subCategory: 'Cardiology',
                  author: 'Clinio AI', readTime: '5 min read', hasVideo: false, videoUrl: '',
                  likes: 0, comments: 0,
                  createdAt: new Date().toISOString().split('T')[0],
                  updatedAt: new Date().toISOString().split('T')[0],
                });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Posts List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">📋 All Posts ({posts.length})</h3>
        {posts.map(post => (
          <div key={post.id} className="card p-4 flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold">{post.title}</h4>
              <p className="text-sm text-gray-500">{post.category} · {post.topic} · {post.readTime}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(post)} className="text-sm text-primary-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(post.id!)} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
