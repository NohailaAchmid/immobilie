import React, { useState } from 'react';
import { Home, Heart, Shield, LogOut, Menu, X, Building2, PhoneCall } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, setCurrentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favoritesCount } = useFavorites();
  const { isAuthenticated, user, logout } = useAuth();

  const handleNav = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">
                IMMOPRESTIGE
              </span>
              <span className="text-xs text-blue-400 font-medium tracking-widest uppercase">
                Immobilier d'Exception
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNav('home')}
              className={`text-sm font-semibold transition-colors hover:text-blue-400 ${currentView === 'home' ? 'text-blue-400' : 'text-slate-300'}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => handleNav('properties')}
              className={`text-sm font-semibold transition-colors hover:text-blue-400 ${currentView === 'properties' ? 'text-blue-400' : 'text-slate-300'}`}
            >
              Tous nos biens
            </button>
            <button 
              onClick={() => handleNav('properties_sale')}
              className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors"
            >
              Vente
            </button>
            <button 
              onClick={() => handleNav('properties_rent')}
              className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-colors"
            >
              Location
            </button>
            <button 
              onClick={() => handleNav('contact')}
              className={`text-sm font-semibold transition-colors hover:text-blue-400 ${currentView === 'contact' ? 'text-blue-400' : 'text-slate-300'}`}
            >
              Contact
            </button>
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Favoris */}
            <button 
              onClick={() => handleNav('favorites')}
              className="relative p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Mes favoris"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Espace Admin */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('admin_dashboard')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('admin_login')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Espace Pro</span>
              </button>
            )}

            <button
              onClick={() => handleNav('contact')}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Estimer mon bien</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={() => handleNav('favorites')}
              className="relative p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <button 
            onClick={() => handleNav('home')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Accueil
          </button>
          <button 
            onClick={() => handleNav('properties')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Tous nos biens
          </button>
          <button 
            onClick={() => handleNav('properties_sale')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Biens en Vente
          </button>
          <button 
            onClick={() => handleNav('properties_rent')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Biens en Location
          </button>
          <button 
            onClick={() => handleNav('contact')}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Contact
          </button>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNav('admin_dashboard')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-medium"
                >
                  <Shield className="w-4 h-4" />
                  Tableau de bord Admin
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 text-rose-400 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNav('admin_login')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium border border-slate-700"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                Connexion Administration
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
