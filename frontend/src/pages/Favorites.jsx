import React from 'react';
import { Heart, ArrowLeft, Trash2, Home } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import PropertyCard from '../components/PropertyCard';

export default function Favorites({ onSelectProperty, setCurrentView }) {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-rose-600" />
            Mes Coups de Cœur
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Propriétés enregistrées
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Retrouvez tous les biens que vous avez sauvegardés lors de votre navigation.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('properties')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold self-start sm:self-auto transition"
        >
          <Home className="w-4 h-4" />
          <span>Continuer ma recherche</span>
        </button>
      </div>

      {/* Grid of favorites */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Aucun bien favori enregistré</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Cliquez sur le petit cœur en haut à droite des annonces pour retrouver facilement vos biens préférés ici.
          </p>
          <button
            onClick={() => setCurrentView('properties')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 shadow-md shadow-blue-500/20 transition"
          >
            Découvrir nos biens
          </button>
        </div>
      )}
    </div>
  );
}
