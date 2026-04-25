import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Mock post data - replace with API call
const MOCK_POST = {
  id: '1',
  title: 'Understanding Heart Failure Management',
  content: `Heart failure is a chronic progressive condition that affects the pumping power of the heart muscles. It occurs when the heart cannot pump enough blood to meet the body's needs.

## Key Points

**Pathophysiology:**
Heart failure results from impaired ventricular filling (diastolic dysfunction) or impaired ventricular ejection (systolic dysfunction). The body attempts to compensate through several mechanisms including the renin-angiotensin-aldosterone system activation and sympathetic nervous system stimulation.

**Clinical Manifestations:**
- Dyspnea on exertion or at rest
- Orthopnea and paroxysmal nocturnal dyspnea
- Fatigue and weakness
- Peripheral edema
- Jugular venous distension
- Hepatomegaly and ascites

**Nursing Assessment:**
1. Monitor vital signs including oxygen saturation
2. Assess lung sounds for crackles or wheezes
3. Monitor daily weight and fluid intake/output
4. Evaluate edema and jugular vein distension
5. Assess for signs of decreased cardiac output

**Management:**
- ACE inhibitors / ARBs to reduce afterload
- Beta-blockers to reduce heart rate and myocardial oxygen demand
- Diuretics for fluid management
- Lifestyle modifications including sodium restriction
- Daily weight monitoring

**Nursing Considerations:**
- Administer medications as prescribed and monitor for side effects
- Educate patients on fluid restriction and daily weight monitoring
- Position patient in semi-Fowler's to facilitate breathing
- Provide emotional support and health education`,
  topic: 'Cardiovascular',
  author: 'Clinio AI',
  readTime: '5 min read',
  createdAt: '2024-01-15',
  likes: 24,
  comments: 3,
  youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  relatedQuizId: 'quiz-heart-failure',
};

const MOCK_COMMENTS = [
  { id: 'c1', author: 'StudentNurse', content: 'Great explanation! Very helpful for my exam prep.', createdAt: '2 days ago', likes: 5 },
  { id: 'c2', author: 'MedStudent', content: 'Can you also cover medications in more detail?', createdAt: '1 day ago', likes: 2 },
  { id: 'c3', author: 'FutureRN', content: 'This helped me understand heart failure much better. Thank you!', createdAt: '12 hours ago', likes: 3 },
];

export const PostDetailContainer: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  // In production, fetch post by postId from API
  const post = MOCK_POST;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button onClick={() => navigate('/feed')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        ← Back to Clinio Room
      </button>

      {/* Post Header */}
      <div>
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
          {post.topic}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-3">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>By {post.author}</span>
          <span>{post.readTime}</span>
          <span>{post.createdAt}</span>
        </div>
      </div>

      {/* YouTube Video */}
      {post.youtubeUrl && (
        <div className="card overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={post.youtubeUrl}
              title="Video lesson"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Post Content */}
      <div className="card">
        <div className="prose prose-gray max-w-none">
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="text-gray-700 ml-4">{line.replace('- ', '')}</li>;
            }
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="text-gray-700 mb-2">{line}</p>;
          })}
        </div>
      </div>

      {/* Try Related Quiz */}
      {post.relatedQuizId && (
        <Link
          to={`/rapid-quiz?topic=${post.topic}`}
          className="card border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 transition-colors flex items-center justify-between p-5"
        >
          <div>
            <p className="font-semibold text-primary-700">📝 Try Related Quiz</p>
            <p className="text-sm text-primary-500">Test your knowledge on {post.topic}</p>
          </div>
          <span className="text-primary-600 text-xl">→</span>
        </Link>
      )}

      {/* Comments Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">
          💬 Comments ({MOCK_COMMENTS.length})
        </h3>
        {MOCK_COMMENTS.map(comment => (
          <div key={comment.id} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{comment.author}</span>
              <span className="text-xs text-gray-400">{comment.createdAt}</span>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <span>❤️ {comment.likes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div className="card p-4">
        <textarea
          placeholder="Add a comment..."
          className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
        />
        <button className="btn-primary mt-3 text-sm">
          Post Comment
        </button>
      </div>

      <div className="pb-8" />
    </div>
  );
};
