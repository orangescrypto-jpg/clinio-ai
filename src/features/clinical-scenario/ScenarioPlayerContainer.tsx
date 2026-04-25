import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const ScenarioPlayerContainer: React.FC = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <p className="text-4xl mb-4">🏥</p>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Clinical Scenario</h3>
      <p className="text-gray-500 mb-4">Scenario ID: {scenarioId}</p>
      <p className="text-sm text-gray-400 mb-6">Step-by-step patient simulation coming soon...</p>
      <button onClick={() => navigate('/scenarios')} className="btn-secondary">
        ← Back to Scenarios
      </button>
    </div>
  );
};
