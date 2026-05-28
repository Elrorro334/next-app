'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Por favor, ingrese usuario y contraseña.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 401) {
        throw new Error('Credenciales inválidas.');
      }
      
      if (response.status === 500) {
        throw new Error('Error interno del servidor. Intente más tarde.');
      }

      if (!response.ok) {
        throw new Error('Error de red o servidor.');
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-slate-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-950">Acceso EVALUMA</h1>
        
        <button className="w-full mb-4 px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition font-medium">
          Iniciar con SSO Corporativo
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">o acceder con cuenta</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          
          {error && <p className="text-red-600 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
