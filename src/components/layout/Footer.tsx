import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 w-full">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Clinio AI</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Smarter learning for healthcare professionals.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/rapid-quiz" className="hover:text-primary-600 transition-colors">Rapid Quiz</Link></li>
              <li><Link to="/exam" className="hover:text-primary-600 transition-colors">Exam Mode</Link></li>
              <li><Link to="/scenarios" className="hover:text-primary-600 transition-colors">Clinical OSCE</Link></li>
              <li><Link to="/feed" className="hover:text-primary-600 transition-colors">Clinio Room</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-primary-600 transition-colors">About Clinio AI</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/disclaimer" className="hover:text-primary-600 transition-colors">Disclaimer</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2026 Clinio AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
