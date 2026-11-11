import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, RotateCcw, 
  MapPin, Home, Sparkles, Filter, ChevronDown 
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { api } from '../services/api';

export default function Properties({ onSelectProperty, globalFilters, setGlobalFilters }) {
  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isListView, setIsListView] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Local filter copy
  const [filters, setFilters] = useState({
    search: globalFilters?.search || '',
    status: globalFilters?.status || 'all',
    type: globalFilters?.type || 'all',
    city: globalFilters?.city || 'all',
    min_price: globalFilters?.min_price || '',
    max_price: globalFilters?.max_price || '',
    bedrooms: globalFilters?.bedrooms || '',
    sort: globalFilters?.sort || 'newest',
  });

  useEffect(() => {
    fetchProperties();
  }, [filters.status, filters.type, filters.city, filters.sort]);

  const fetchProperties = async (customFilters = filters) => {
    try {
      setLoading(true);
      const res = await api.getProperties(customFilters);
      if (res.status === 'success') {
        setProperties(res.data);
        if (res.cities) setCities(res.cities);
      }
    } catch (err) {
      console.error('Erreur chargement catalogue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchProperties();
  };

  const handleReset = () => {
    const resetValues = {
      search: '',
      status: 'all',
      type: 'all',
      city: 'all',
      min_price: '',
      max_price: '',
      bedrooms: '',
      sort: 'newest',
    };
    setFilters(resetValues);
    fetchProperties(resetValues);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header title & breadcrumb */}
      <div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Notre Catalogue Immobilier
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          {filters.status === 'Vente' ? 'Biens à la Vente' : filters.status === 'Location' ? 'Biens à la Location' : 'Tous nos biens immobiliers'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explorez nos propriétés sélectionnées avec soin selon vos critères.
        </p>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5">
        
        {/* Top bar: Search input + Status Tabs + Reset */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl w-full lg:w-auto">
            {[
              { label: 'Tous', val: 'all' },
              { label: 'Acheter (Vente)', val: 'Vente' },
              { label: 'Louer (Location)', val: 'Location' },
            ].map(tab => (
              <button
                key={tab.val}
                type="button"
                onClick={() => handleFilterChange('status', tab.val)}
                className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  filters.status === tab.val
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par titre, ville, mot-clé..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
            >
              Rechercher
            </button>
          </form>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>

        {/* Detailed Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Type de bien</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="all">Tous les types</option>
              <option value="Appartement">Appartement</option>
              <option value="Villa">Villa</option>
              <option value="Maison">Maison</option>
              <option value="Studio">Studio</option>
              <option value="Riad">Riad</option>
              <option value="Bureau">Bureau</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Ville</label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="all">Toutes les villes</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Prix minimum (€)</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.min_price}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              onBlur={() => fetchProperties()}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Prix maximum (€)</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.max_price}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              onBlur={() => fetchProperties()}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

      </div>

      {/* Results Header: Count & Sorting & Layout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="text-sm font-semibold text-slate-700">
          <span className="text-blue-600 font-bold text-base">{properties.length}</span> bien(s) disponible(s)
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Trier par:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="newest">Plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="surface_desc">Plus grande surface</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-slate-100 rounded-2xl h-80 animate-pulse"></div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Aucun résultat trouvé</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Aucun bien ne correspond à vos critères actuels. Essayez d'élargir votre recherche.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

    </div>
  );
}
