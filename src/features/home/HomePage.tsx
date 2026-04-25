import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { title: 'Rapid Quiz', icon: '⚡', description: 'Timed questions with instant feedback and explanations', link: '/rapid-quiz', color: 'bg-orange-50 border-orange-200 hover:border-orange-300', iconBg: 'bg-orange-100' },
  { title: 'Clinical OSCE', icon: '🏥', description: 'Step-by-step patient case simulations with clinical reasoning', link: '/scenarios', color: 'bg-green-50 border-green-200 hover:border-green-300', iconBg: 'bg-green-100' },
  { title: 'Clinio Room', icon: '📚', description: 'Educational content, videos, and discussions', link: '/feed', color: 'bg-blue-50 border-blue-200 hover:border-blue-300', iconBg: 'bg-blue-100' },
  { title: 'Exam Mode', icon: '📝', description: 'Full exam simulation with results and performance breakdown', link: '/exam', color: 'bg-red-50 border-red-200 hover:border-red-300', iconBg: 'bg-red-100' },
];

const categories = [
  { icon: '🏥', label: 'Clinical Medicine' },
  { icon: '🩺', label: 'NCLEX' },
  { icon: '🇳🇬', label: 'NMCN' },
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

      {/* Categories - Only 3 */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {categories.map(cat => (
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

      {/* CTA */}
      <div className="text-center pb-4">
        <Link to="/rapid-quiz" className="btn-primary inline-block text-lg px-8 py-3 shadow-lg hover:shadow-xl">Start Practice Now</Link>
        <p className="text-sm text-gray-400 mt-2">No login required</p>
      </div>
    </div>
  );
};
