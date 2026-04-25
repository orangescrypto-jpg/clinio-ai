import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { title: 'Rapid Quiz', icon: '⚡', description: 'Timed questions with instant feedback and explanations', link: '/rapid-quiz', color: 'bg-orange-50 border-orange-200 hover:border-orange-300', iconBg: 'bg-orange-100' },
  { title: 'Clinical OSCE', icon: '🏥', description: 'Step-by-step patient case simulations with clinical reasoning', link: '/scenarios', color: 'bg-green-50 border-green-200 hover:border-green-300', iconBg: 'bg-green-100' },
  { title: 'Clinio Room', icon: '📚', description: 'Educational content, videos, and discussions', link: '/feed', color: 'bg-blue-50 border-blue-200 hover:border-blue-300', iconBg: 'bg-blue-100' },
  { title: 'Exam Mode', icon: '📝', description: 'Full exam simulation with results and performance breakdown', link: '/exam', color: 'bg-red-50 border-red-200 hover:border-red-300', iconBg: 'bg-red-100' },
];

const latestPosts = [
  { id: '1', title: 'Understanding Heart Failure Management', preview: 'Heart failure is a chronic condition affecting the heart\'s pumping ability. Learn about pathophysiology, assessment, and nursing interventions.', topic: 'Cardiovascular', category: 'Clinical Medicine', readTime: '5 min read', date: '2 days ago', hasVideo: false },
  { id: '2', title: 'NCLEX Pharmacology: Must-Know Drug Classes', preview: 'Master the most commonly tested drug classes for NCLEX. Covers mechanisms of action, side effects, and nursing considerations.', topic: 'Pharmacology', category: 'NCLEX', readTime: '7 min read', date: '3 days ago', hasVideo: true },
  { id: '3', title: 'Clinical Assessment: Respiratory System', preview: 'A systematic approach to respiratory examination including inspection, palpation, percussion, and auscultation techniques.', topic: 'Respiratory', category: 'Clinical Medicine', readTime: '6 min read', date: '5 days ago', hasVideo: false },
];

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">Clinio AI</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
          Smarter learning for healthcare professionals
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {[
          { icon: '🏥', label: 'Clinical Medicine' },
          { icon: '🩺', label: 'NCLEX' },
          { icon: '🇳🇬', label: 'NMCN' },
        ].map(cat => (
          <div key={cat.label} className="text-center p-5 bg-white rounded-xl border-2 border-gray-200 hover:shadow-md transition-all cursor-pointer hover:border-primary-300">
            <span className="text-2xl">{cat.icon}</span>
            <p className="text-sm font-medium text-gray-700 mt-1">{cat.label}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Choose Your Study Mode</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {features.map(feature => (
            <Link key={feature.title} to={feature.link} className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${feature.color}`}>
              <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center text-2xl mb-3`}>{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Posts */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">📚 Latest from Clinio Room</h2>
          <Link to="/feed" className="text-sm text-primary-600 font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {latestPosts.map(post => (
            <Link key={post.id} to={`/feed/${post.id}`} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">{post.topic}</span>
                {post.hasVideo && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">🎬 Video</span>}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{post.preview}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{post.readTime}</span>
                <span>{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pb-4">
        <Link to="/rapid-quiz" className="btn-primary inline-block text-lg px-8 py-3 shadow-lg hover:shadow-xl">Start Practice Now</Link>
        <p className="text-sm text-gray-400 mt-2">No login required</p>
      </div>
    </div>
  );
};
