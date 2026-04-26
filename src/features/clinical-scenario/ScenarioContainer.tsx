import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Scenario {
  id: string;
  title: string;
  preview: string;
  topic: string;
  category: string;
  readTime: string;
  createdAt: string;
}

const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents';

export const ScenarioContainer: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await fetch(`${FIRESTORE_URL}/posts`);
      const data = await response.json();
      
      if (data.documents) {
        const allPosts = data.documents
          .map((doc: any) => {
            const f = doc.fields;
            return {
              id: doc.name.split('/').pop(),
              title: f.title?.stringValue || '',
              preview: f.preview?.stringValue || '',
              topic: f.topic?.stringValue || '',
              category: f.category?.stringValue || '',
              subCategory: f.subCategory?.stringValue || '',
              readTime: f.readTime?.stringValue || '',
              createdAt: f.createdAt?.stringValue || '',
            };
          })
          .filter((p: any) => 
            p.subCategory === 'OSCE'
          );
        
        setScenarios(allPosts);
      }
    } catch (err) {
      console.error('Failed to load scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading scenarios...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🏥 Clinical Scenarios (OSCE)</h2>
        <p className="text-gray-500 mt-1">Step-by-step patient case simulations with clinical reasoning</p>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🏥</p>
          <p className="text-gray-500">No OSCE scenarios yet. Create one in the admin panel!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scenarios.map(scenario => (
            <Link
              key={scenario.id}
              to={`/feed/${scenario.id}`}
              className="card p-6 block hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-clinical-light text-clinical-dark px-2 py-0.5 rounded-full font-medium">
                    {scenario.topic}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {scenario.category}
                  </span>
                </div>
                <span className="text-sm text-gray-400">{scenario.readTime}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {scenario.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">{scenario.preview}</p>
              <span className="inline-block mt-4 text-sm font-medium text-green-600 group-hover:translate-x-1 transition-transform">
                Start Scenario →
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="pb-8" />
    </div>
  );
};
