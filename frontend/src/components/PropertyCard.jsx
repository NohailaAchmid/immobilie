import React from 'react';
import { MapPin, Bed, Bath, Maximize, Heart, ArrowUpRight, Sparkles } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

export default function PropertyCard({ property, onSelect }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(property.price);

  const isRent = property.status === 'Location';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

        {/* Badges top left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md ${
            isRent ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            {property.status}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-white shadow-md">
            {property.type}
          </span>
          {Number(property.featured) === 1 && (
            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              Coup de Cœur
            </span>
          )}
        </div>

        {/* Favorite button top right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property);
          }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 backdrop-blur-sm shadow-md transition transform active:scale-90"
          title={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* City tag on bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-white/95 bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-md">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>{property.city}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formattedPrice}
            </span>
            {isRent && <span className="text-sm font-medium text-slate-500">/ mois</span>}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="font-bold text-slate-900 text-base leading-snug line-clamp-1 hover:text-blue-600 cursor-pointer transition"
          >
            {property.title}
          </h3>

          {/* Address / short snippet */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {property.address || property.city}
          </p>
        </div>

        {/* Features icons row */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5" title="Surface habitable">
            <Maximize className="w-4 h-4 text-slate-400" />
            <span>{property.surface} m²</span>
          </div>

          <div className="flex items-center gap-1.5" title="Chambres">
            <Bed className="w-4 h-4 text-slate-400" />
            <span>{property.bedrooms} ch.</span>
          </div>

          <div className="flex items-center gap-1.5" title="Salles de bain">
            <Bath className="w-4 h-4 text-slate-400" />
            <span>{property.bathrooms} sdb</span>
          </div>

          <button
            onClick={() => onSelect(property)}
            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition group-hover:bg-blue-600 group-hover:text-white"
            title="Détails"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
