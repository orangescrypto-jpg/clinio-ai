import React, { useState } from 'react';

const ADMIN_PASSWORD = 'clinio2026';

interface Props {
  onLogin: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('clinio_admin', 'true');
      onLogin();
    } else {
      setError('Wrong password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card max-w-sm w-full p-8">
        <h1 className="text-2xl font-bold text-center mb-6">🔐 Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter admin password"
            className="input-field"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          Default password: clinio2026
        </p>
      </div>
    </div>
  );
};
