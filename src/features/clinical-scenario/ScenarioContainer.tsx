import React from 'react';

const MOCK_SCENARIOS = [
  {
    id: '1',
    title: 'Acute Myocardial Infarction',
    description: 'A 58-year-old male presents with crushing chest pain radiating to the left arm.',
    specialty: 'Cardiology',
    totalSteps: 5,
  },
  {
    id: '2',
    title: 'Diabetic Ketoacidosis',
    description: 'A 25-year-old female with type 1 diabetes presents with nausea, vomiting, and abdominal pain.',
    specialty: 'Endocrinology',
    totalSteps: 4,
  },
  {
    id: '3',
    title: 'Postpartum Hemorrhage',
    description: 'A 32-year-old female develops heavy bleeding after vaginal delivery.',
    specialty: 'Obstetrics',
    totalSteps: 6,
  },
];

export const ScenarioContainer: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Clinical Scenarios (OSCE)</h2>
        <p className="text-gray-600 mt-1">Step-by-step patient case simulations</p>
      </div>

      <div className="space-y-4">
        {MOCK_SCENARIOS.map(scenario => (
          <div key={scenario.id} className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs bg-clinical-light text-clinical-dark px-2 py-0.5 rounded-full font-medium">
                {scenario.specialty}
              </span>
              <span className="text-sm text-gray-400">{scenario.totalSteps} steps</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{scenario.title}</h3>
            <p className="text-sm text-gray-600">{scenario.description}</p>
            <button className="mt-4 text-sm font-medium text-clinical-DEFAULT hover:text-clinical-dark">
              Start Scenario →
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 pb-8">
        🏥 More scenarios coming soon...
      </p>
    </div>
  );
};
