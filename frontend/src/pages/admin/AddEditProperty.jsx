import React, { useState, useEffect } from 'react';
import { 
  Save, ArrowLeft, Image as ImageIcon, Upload, Check, AlertCircle, 
  Building, MapPin, Euro, Maximize, Sparkles 
} from 'lucide-react';
import { api } from '../../services/api';

const AVAILABLE_AMENITIES = [
  'Piscine', 'Climatisation', 'Garage', 'Jardin', 'Balcon', 'Terrasse', 
  'Ascenseur', 'Vue mer', 'Alarme', 'Fibre optique', 'Cave', 'Meublé', 'Cheminée', 'Accès PMR'
];

export default function AddEditProperty({ propertyToEdit, onSaveSuccess, onCancel }) {
  const isEditing = Boolean(propertyToEdit?.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Appartement',
    status: 'Vente',
    price: '',
    surface: '',
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    city: 'Paris',
    address: '',
    image_url: '',
    featured: 0,
    features: [],
    gallery_text: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propertyToEdit) {
      const featuresArr = propertyToEdit.features 
        ? propertyToEdit.features.split(',').map(s => s.trim()).filter(Boolean) 
        : [];

      const galleryUrls = propertyToEdit.gallery 
        ? propertyToEdit.gallery.map(g => g.image_url).join('\n') 
        : '';

      setFormData({
        title: propertyToEdit.title || '',
        description: propertyToEdit.description || '',
        type: propertyToEdit.type || 'Appartement',
        status: propertyToEdit.status || 'Vente',
        price: propertyToEdit.price || '',
        surface: propertyToEdit.surface || '',
        rooms: propertyToEdit.rooms || 1,
        bedrooms: propertyToEdit.bedrooms || 1,
        bathrooms: propertyToEdit.bathrooms || 1,
        city: propertyToEdit.city || '',
        address: propertyToEdit.address || '',
        image_url: propertyToEdit.image_url || '',
        featured: propertyToEdit.featured ? 1 : 0,
        features: featuresArr,
        gallery_text: galleryUrls,
      });

      setImagePreview(propertyToEdit.image_url);
    }
  }, [propertyToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const current = prev.features || [];
      if (current.includes(amenity)) {
        return { ...prev, features: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, features: [...current, amenity] };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const galleryArray = formData.gallery_text
        ? formData.gallery_text.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      // Si un fichier est sélectionné, on utilise FormData
      if (imageFile) {
        const data = new FormData();
        if (isEditing) data.append('id', propertyToEdit.id);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('type', formData.type);
        data.append('status', formData.status);
        data.append('price', formData.price);
        data.append('surface', formData.surface);
        data.append('rooms', formData.rooms);
        data.append('bedrooms', formData.bedrooms);
        data.append('bathrooms', formData.bathrooms);
        data.append('city', formData.city);
        data.append('address', formData.address);
        data.append('featured', formData.featured);
        data.append('features', formData.features.join(','));
        data.append('image', imageFile);

        galleryArray.forEach((url, i) => {
          data.append(`gallery[${i}]`, url);
        });

        if (isEditing) {
          await api.updateProperty(data);
        } else {
          await api.createProperty(data);
        }
      } else {
        // Envoi JSON
        const payload = {
          ...formData,
          id: isEditing ? propertyToEdit.id : undefined,
          gallery: galleryArray,
        };

        if (isEditing) {
          await api.updateProperty(payload);
        } else {
          await api.createProperty(payload);
        }
      }

      onSaveSuccess();
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isEditing ? `Modifier l'annonce #${propertyToEdit.id}` : 'Ajouter un nouveau bien'}
            </h2>
            <p className="text-xs text-slate-500">
              Renseignez les caractéristiques complètes du bien immobilier
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1 : Informations Principales */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            1. Informations générales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Titre de l'annonce *</label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Villa contemporaine avec vue mer féerique"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Mise en avant</label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={Boolean(formData.featured)}
                  onChange={handleChange}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Coup de cœur (Page d'accueil)
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Type de transaction *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
              >
                <option value="Vente">Vente</option>
                <option value="Location">Location</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Catégorie du bien *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
              >
                <option value="Appartement">Appartement</option>
                <option value="Villa">Villa</option>
                <option value="Maison">Maison</option>
                <option value="Studio">Studio</option>
                <option value="Riad">Riad</option>
                <option value="Bureau">Bureau</option>
                <option value="Terrain">Terrain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Prix (€) *</label>
              <input
                type="number"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 450000"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Surface (m²) *</label>
              <input
                type="number"
                required
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                placeholder="Ex: 120"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2 : Pièces & Localisation */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            2. Pièces & Localisation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Nombre de pièces</label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Chambres</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Salles de bain</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Ville *</label>
              <input
                type="text"
                required
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ex: Cannes, Paris, Lyon..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Adresse ou quartier</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ex: 14 Boulevard de la Croisette"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 3 : Photos & Galerie */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            3. Photographies & Visuels
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  URL de l'image principale
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={(e) => {
                    handleChange(e);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Ou téléverser depuis votre ordinateur
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Images supplémentaires de la galerie (1 URL par ligne)
                </label>
                <textarea
                  rows="3"
                  value={formData.gallery_text}
                  onChange={(e) => setFormData({ ...formData, gallery_text: e.target.value })}
                  placeholder="https://...&#10;https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                ></textarea>
              </div>
            </div>

            {/* Preview image */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Aperçu photo principale</span>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-48 object-cover rounded-xl shadow-md"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'; }}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-slate-100 rounded-xl text-slate-400 text-xs">
                  Aucune photo renseignée
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4 : Équipements & Description */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            4. Équipements & Description détaillée
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Prestations disponibles
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {AVAILABLE_AMENITIES.map(amenity => {
                const checked = formData.features.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border text-left transition ${
                      checked
                        ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${checked ? 'bg-blue-600 text-white' : 'border border-slate-300'}`}>
                      {checked && <Check className="w-3 h-3" />}
                    </div>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Description complète *</label>
            <textarea
              rows="5"
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez l'état général, les finitions, l'exposition, l'environnement, le quartier..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm"
            ></textarea>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour le bien' : 'Créer l\'annonce'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
