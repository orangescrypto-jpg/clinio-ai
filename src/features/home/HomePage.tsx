import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Rapid Quiz',
    icon: '⚡',
    description: 'Timed questions with instant feedback and explanations',
    link: '/rapid-quiz',
    color: 'bg-orange-50 border-orange-200 hover:border-orange-300',
    iconBg: 'bg-orange-100',
  },
  {
    title: 'Clinical OSCE',
    icon: '🏥',
    description: 'Step-by-step patient case simulations with clinical reasoning',
    link: '/scenarios',
    color: 'bg-green-50 border-green-200 hover:border-green-300',
    iconBg: 'bg-green-100',
  },
  {
    title: 'Clinico Room',
    icon: '📚',
    description: 'Educational content, videos, and discussions',
    link: '/feed',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
    iconBg: 'bg-blue-100',
  },
  {
    title: 'Exam Mode',
    icon: '📝',
    description: 'Full exam simulation with results and performance breakdown',
    link: '/exam',
    color: 'bg-red-50 border-red-200 hover:border-red-300',
    iconBg: 'bg-red-100',
  },
];

const stats = [
  { label: 'Clinical Medicine', icon: '🏥' },
  { label: 'NCLEX', icon: '🩺' },
  { label: 'NMCN', icon: '🇳🇬' },
];

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Welcome to <span className="text-primary-600">Clinio AI</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Advanced clinical learning platform for nursing and medical students.
          Practice with quizzes, exams, and clinical scenarios.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {stats.map(stat => (
          <div key={stat.label} className="text-center p-4 bg-white rounded-xl border border-gray-200">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {features.map(feature => (
          <Link
            key={feature.title}
            to={feature.link}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${feature.color} group`}
          >
            <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center text-2xl mb-3`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Start */}
      <div className="text-center">
        <Link
          to="/rapid-quiz"
          className="btn-primary inline-block text-lg px-8 py-3"
        >
          Start Practice Now
        </Link>
        <p className="text-sm text-gray-500 mt-2">No login required</p>
      </div>
    </div>
  );
};
