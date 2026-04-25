import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const PostDetailContainer: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <p className="text-4xl mb-4">📝</p>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Post Detail</h3>
      <p className="text-gray-500 mb-4">Post ID: {postId}</p>
      <p className="text-sm text-gray-400 mb-6">Full post view with comments coming soon...</p>
      <button onClick={() => navigate('/feed')} className="btn-secondary">
        ← Back to Feed
      </button>
    </div>
  );
};
