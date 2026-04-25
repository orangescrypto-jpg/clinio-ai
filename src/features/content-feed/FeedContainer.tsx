import React from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  preview: string;
  topic: string;
  category: string;
  readTime: string;
  createdAt: string;
  likes: number;
  comments: number;
  hasVideo: boolean;
}

const POSTS: Post[] = [
  {
    id: '1',
    title: 'Understanding Heart Failure Management',
    preview: 'Heart failure is a chronic condition affecting the heart\'s pumping ability. Learn about pathophysiology, assessment, and nursing interventions.',
    topic: 'Cardiovascular',
    category: 'Clinical Medicine',
    readTime: '5 min read',
    createdAt: '2024-01-15',
    likes: 24,
    comments: 3,
    hasVideo: false,
  },
  {
    id: '2',
    title: 'NCLEX Pharmacology: Must-Know Drug Classes',
    preview: 'Master the most commonly tested drug classes for NCLEX. Covers mechanisms of action, side effects, and nursing considerations.',
    topic: 'Pharmacology',
    category: 'NCLEX',
    readTime: '7 min read',
    createdAt: '2024-01-12',
    likes: 18,
    comments: 5,
    hasVideo: true,
  },
  {
    id: '3',
    title: 'Clinical Assessment: Respiratory System',
    preview: 'A systematic approach to respiratory examination including inspection, palpation, percussion, and auscultation techniques.',
    topic: 'Respiratory',
    category: 'Clinical Medicine',
    readTime: '6 min read',
    createdAt: '2024-01-10',
    likes: 31,
    comments: 7,
    hasVideo: false,
  },
  {
    id: '4',
    title: 'NMCN: Community Health Nursing Essentials',
    preview: 'Key concepts in community health nursing for NMCN exam preparation. Covers primary health care and disease prevention.',
    topic: 'Community Health',
    category: 'NMCN',
    readTime: '8 min read',
    createdAt: '2024-01-08',
    likes: 15,
    comments: 2,
    hasVideo: false,
  },
];

export const FeedContainer: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">📚 Clinio Room</h2>
        <p className="text-gray-500 mt-1">Educational content for nursing and medical students</p>
      </div>

      <div className="space-y-4">
        {POSTS.map(post => (
          <Link key={post.id} to={`/feed/${post.id}`} className="card p-5 block hover:shadow-md transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">{post.topic}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{post.category}</span>
              {post.hasVideo && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">🎬 Video</span>}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{post.title}</h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.preview}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{post.readTime} · {post.createdAt}</span>
              <div className="flex items-center gap-3">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
