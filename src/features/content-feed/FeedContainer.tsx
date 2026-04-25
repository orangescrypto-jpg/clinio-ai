import React from 'react';

const MOCK_POSTS = [
  {
    id: '1',
    title: 'Understanding Heart Failure Management',
    content: 'Heart failure management requires a comprehensive approach including medications, lifestyle changes, and monitoring. Key medications include ACE inhibitors, beta-blockers, and diuretics...',
    topic: 'Cardiovascular',
    author: 'Clinio AI',
    readTime: '5 min read',
    createdAt: '2024-01-15',
    likes: 24,
    comments: 3,
  },
  {
    id: '2',
    title: 'NCLEX Pharmacology Tips: Must-Know Drug Classes',
    content: 'Mastering pharmacology for NCLEX requires understanding drug classes, side effects, and nursing considerations. Focus on the most commonly tested medications...',
    topic: 'Pharmacology',
    author: 'Clinio AI',
    readTime: '7 min read',
    createdAt: '2024-01-12',
    likes: 18,
    comments: 5,
  },
  {
    id: '3',
    title: 'Clinical OSCE: Respiratory Assessment Guide',
    content: 'A systematic approach to respiratory assessment including inspection, palpation, percussion, and auscultation. Learn to identify common breath sounds and their clinical significance...',
    topic: 'Respiratory',
    author: 'Clinio AI',
    readTime: '6 min read',
    createdAt: '2024-01-10',
    likes: 31,
    comments: 7,
  },
];

export const FeedContainer: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Clinio Room</h2>
        <p className="text-gray-600 mt-1">Educational content for nursing and medical students</p>
      </div>

      <div className="space-y-4">
        {MOCK_POSTS.map(post => (
          <div key={post.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                {post.topic}
              </span>
              <span className="text-xs text-gray-400">{post.readTime}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>By {post.author} · {post.createdAt}</span>
              <div className="flex items-center gap-3">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 pb-8">
        📚 More content coming soon...
      </p>
    </div>
  );
};
