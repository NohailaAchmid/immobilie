import React from 'react';
import { Search, MapPin, Home, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onSearch, cities = [] }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      city: 'all',
      min_price: '',
      max_price: '',
      bedrooms: '',
      sort: 'newest',
    });
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-200/80">
      {/* Transaction Type Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => handleChange('status', 'all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            filters.status === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tous les biens
        </button>
        <button
          type="button"
          onClick={() => handleChange('status', 'Vente')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            filters.status === 'Vente'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Acheter (Vente)
        </button>
        <button
          type="button"
          onClick={() => handleChange('status', 'Location')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            filters.status === 'Location'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Louer (Location)
        </button>
      </div>

      {/* Main Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Mot-clé / Quartier
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ex: Villa piscine, Paris 16..."
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Type de bien
          </label>
          <div className="relative">
            <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={filters.type || 'all'}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
            >
              <option value="all">Tous les types</option>
              <option value="Appartement">Appartement</option>
              <option value="Villa">Villa</option>
              <option value="Maison">Maison</option>
              <option value="Studio">Studio</option>
              <option value="Riad">Riad</option>
              <option value="Bureau">Bureau / Commerce</option>
              <option value="Terrain">Terrain</option>
            </select>
          </div>
        </div>

        {/* City Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Ville / Destination
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={filters.city || 'all'}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
            >
              <option value="all">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget Max */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Budget Maximum (€)
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="Ex: 500000"
              value={filters.max_price || ''}
              onChange={(e) => handleChange('max_price', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser les filtres</span>
        </button>

        <button
          type="button"
          onClick={onSearch}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition transform active:scale-95"
        >
          <Search className="w-4 h-4" />
          <span>Rechercher</span>
        </button>
      </div>
    </div>
  );
}
