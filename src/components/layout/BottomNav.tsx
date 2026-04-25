import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/rapid-quiz', icon: '⚡', label: 'Quiz' },
  { to: '/feed', icon: '📚', label: 'Clinico' },
  { to: '/exam', icon: '📝', label: 'Exam' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
