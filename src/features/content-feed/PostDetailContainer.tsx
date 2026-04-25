import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface Comment {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  postId: string;
}

interface Post {
  id: string;
  title: string;
  preview: string;
  content: string;
  topic: string;
  category: string;
  subCategory?: string;
  author: string;
  readTime: string;
  createdAt: string;
  likes: number;
  videoUrl?: string;
  hasVideo: boolean;
}

const MOCK_POSTS: Record<string, Post> = {
  '1': {
    id: '1',
    title: 'Understanding Heart Failure Management',
    preview: 'Heart failure is a chronic condition affecting the heart\'s pumping ability.',
    content: `Heart failure is a chronic progressive condition that affects the pumping power of the heart muscles.

## Pathophysiology

Heart failure results from impaired ventricular filling (diastolic dysfunction) or impaired ventricular ejection (systolic dysfunction).

## Clinical Manifestations

- Dyspnea on exertion or at rest
- Orthopnea and paroxysmal nocturnal dyspnea
- Fatigue and weakness
- Peripheral edema
- Jugular venous distension

## Nursing Assessment

1. Monitor vital signs including oxygen saturation
2. Assess lung sounds for crackles or wheezes
3. Monitor daily weight and fluid intake/output
4. Evaluate edema and jugular vein distension

## Management

- ACE inhibitors / ARBs to reduce afterload
- Beta-blockers to reduce heart rate
- Diuretics for fluid management
- Sodium restriction and lifestyle modifications`,
    topic: 'Cardiovascular',
    category: 'Clinical Medicine',
    subCategory: 'Cardiology',
    author: 'Clinio AI',
    readTime: '5 min read',
    createdAt: '2024-01-15',
    likes: 24,
    hasVideo: false,
  },
  '2': {
    id: '2',
    title: 'NCLEX Pharmacology: Must-Know Drug Classes',
    preview: 'Master the most commonly tested drug classes for NCLEX.',
    content: `Pharmacology is a critical component of the NCLEX examination.

## Key Drug Classes

**ACE Inhibitors**
- Examples: Lisinopril, Enalapril
- Action: Block angiotensin-converting enzyme
- Side effects: Dry cough, hyperkalemia, angioedema

**Beta Blockers**
- Examples: Metoprolol, Atenolol
- Action: Block beta-adrenergic receptors
- Side effects: Bradycardia, fatigue, bronchospasm

## Nursing Considerations

- Always check blood pressure before administration
- Monitor for adverse effects
- Patient education on medication compliance`,
    topic: 'Pharmacology',
    category: 'NCLEX',
    subCategory: 'Pharmacology',
    author: 'Clinio AI',
    readTime: '7 min read',
    createdAt: '2024-01-12',
    likes: 18,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    hasVideo: true,
  },
  '3': {
    id: '3',
    title: 'Clinical Assessment: Respiratory System',
    preview: 'A systematic approach to respiratory examination.',
    content: `A thorough respiratory assessment is essential for identifying pulmonary conditions.

## Inspection

Observe the patient's breathing pattern, rate, and effort. Look for use of accessory muscles, cyanosis, and chest wall abnormalities.

## Palpation

Assess for tactile fremitus, chest expansion, and tenderness.

## Percussion

Percuss the chest wall to identify areas of dullness or hyperresonance.

## Auscultation

Listen for normal breath sounds and adventitious sounds including crackles, wheezes, and rhonchi.`,
    topic: 'Respiratory',
    category: 'Clinical Medicine',
    subCategory: 'Pulmonology',
    author: 'Clinio AI',
    readTime: '6 min read',
    createdAt: '2024-01-10',
    likes: 31,
    hasVideo: false,
  },
};

export const PostDetailContainer: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([
    { id: 'c1', name: 'NursingStudent', message: 'Great explanation! Very helpful.', timestamp: '2 days ago', postId: '1' },
    { id: 'c2', name: 'MedLearner', message: 'Can you add more on medications?', timestamp: '1 day ago', postId: '1' },
  ]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const post = postId ? MOCK_POSTS[postId] : undefined;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    const comment: Comment = {
      id: 'c' + Date.now(),
      name: newName.trim(),
      message: newMessage.trim(),
      timestamp: 'Just now',
      postId: postId || '',
    };

    setComments([comment, ...comments]);
    setNewName('');
    setNewMessage('');
  };

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

  const postComments = comments.filter(c => c.postId === postId);

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
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
          <span>{post.category}{post.subCategory ? ` · ${post.subCategory}` : ''}</span>
          <span>{post.readTime}</span>
          <span>{post.createdAt}</span>
        </div>
      </div>

      {/* Video - Only shown if videoUrl exists */}
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
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.replace('## ', '')}</h2>;
            if (line.startsWith('**') && line.endsWith('**')) return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
            if (line.startsWith('- ')) return <li key={i} className="text-gray-700 ml-4">{line.replace('- ', '')}</li>;
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="mb-2">{line}</p>;
          })}
        </div>
      </div>

      {/* Related Quiz Link */}
      <Link to={`/rapid-quiz?topic=${post.topic}`} className="card border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 transition-colors flex items-center justify-between p-5">
        <div>
          <p className="font-semibold text-primary-700">📝 Try Related Quiz</p>
          <p className="text-sm text-primary-500">Test your knowledge on {post.topic}</p>
        </div>
        <span className="text-primary-600 text-xl">→</span>
      </Link>

      {/* Comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">💬 Comments ({postComments.length})</h3>

        {/* Add Comment */}
        <form onSubmit={handleAddComment} className="card p-4 space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="input-field text-sm"
            required
          />
          <textarea
            placeholder="Write a comment..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            className="input-field text-sm"
            rows={3}
            required
          />
          <button type="submit" className="btn-primary text-sm">Post Comment</button>
        </form>

        {/* Comment List */}
        {postComments.map(comment => (
          <div key={comment.id} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 text-sm">{comment.name}</span>
              <span className="text-xs text-gray-400">{comment.timestamp}</span>
            </div>
            <p className="text-sm text-gray-700">{comment.message}</p>
          </div>
        ))}
      </div>

      <div className="pb-8" />
    </div>
  );
};
