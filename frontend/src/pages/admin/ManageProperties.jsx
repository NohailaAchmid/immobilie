import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, Search, Sparkles, AlertCircle, 
  MapPin, Check, ExternalLink 
} from 'lucide-react';
import { api } from '../../services/api';

export default function ManageProperties({ onAddClick, onEditClick, onViewPublic }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await api.getProperties();
      if (res.status === 'success') {
        setProperties(res.data);
      }
    } catch (err) {
      console.error('Erreur chargement biens admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await api.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProperties = properties.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      p.type.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6">
      
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Catalogue des Biens</h2>
          <p className="text-xs text-slate-500">
            {properties.length} biens répertoriés dans la base de données
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrer par titre, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Add property button */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un bien</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Chargement des biens...</p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3 pl-2">Bien</th>
                <th className="pb-3">Type & Statut</th>
                <th className="pb-3">Prix</th>
                <th className="pb-3">Ville</th>
                <th className="pb-3">Surface & Pièces</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map(property => {
                const formattedPrice = new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }).format(property.price);

                return (
                  <tr key={property.id} className="hover:bg-slate-50/80 transition group">
                    {/* Thumbnail + Title */}
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.image_url}
                          alt={property.title}
                          className="w-14 h-12 rounded-xl object-cover shadow-sm shrink-0"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&q=80'; }}
                        />
                        <div className="max-w-[200px] sm:max-w-xs">
                          <div className="font-bold text-slate-900 truncate">
                            {property.title}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>Réf #{property.id}</span>
                            {Number(property.featured) === 1 && (
                              <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                                • <Sparkles className="w-3 h-3 fill-amber-500" /> Vedette
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type & Status */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          property.status === 'Location' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {property.status}
                        </span>
                        <span className="text-slate-600 font-medium">{property.type}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 font-bold text-slate-900">
                      {formattedPrice}
                      {property.status === 'Location' && <span className="text-[11px] text-slate-400 font-normal"> /m</span>}
                    </td>

                    {/* City */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{property.city}</span>
                      </div>
                    </td>

                    {/* Surface & Rooms */}
                    <td className="py-3.5 text-slate-600">
                      {property.surface} m² • {property.rooms} p.
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewPublic(property.id)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                          title="Voir sur le site public"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditClick(property)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(property.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 text-sm">
          Aucun bien ne correspond à votre recherche.
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Confirmer la suppression ?</h3>
              <p className="text-xs text-slate-500">
                Cette action supprimera définitivement le bien et toutes ses photos associées.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
