import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username.trim(), password.trim());
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Espace Administration
          </h2>
          <p className="text-xs text-slate-500">
            Gestion du catalogue immobilier & des demandes clients
          </p>
        </div>

        {/* Demo Credentials Alert */}
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-blue-700">
            <CheckCircle2 className="w-4 h-4" />
            Identifiants par défaut :
          </div>
          <div className="text-blue-800">
            Utilisateur: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">admin</code> | 
            Mot de passe: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">admin123</code>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Identifiant
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Connexion en cours...' : 'Se connecter au tableau de bord'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onBackToSite}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            ← Retourner au site public
          </button>
        </div>

      </div>
    </div>
  );
}
