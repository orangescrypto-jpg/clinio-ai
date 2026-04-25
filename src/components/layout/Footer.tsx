import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Clinio AI</h4>
            <p className="text-sm text-gray-500">AI-powered learning for nursing and medical students.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/rapid-quiz" className="hover:text-primary-600">Rapid Quiz</Link></li>
              <li><Link to="/exam" className="hover:text-primary-600">Exam Mode</Link></li>
              <li><Link to="/scenarios" className="hover:text-primary-600">Clinical OSCE</Link></li>
              <li><Link to="/feed" className="hover:text-primary-600">Clinio Room</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">About</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="cursor-pointer hover:text-primary-600">About Clinio AI</span></li>
              <li><span className="cursor-pointer hover:text-primary-600">Contact</span></li>
              <li><span className="cursor-pointer hover:text-primary-600">Privacy Policy</span></li>
              <li><span className="cursor-pointer hover:text-primary-600">Terms of Service</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>🏥 Clinical Medicine</li>
              <li>🩺 NCLEX</li>
              <li>🇳🇬 NMCN</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Clinio AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
