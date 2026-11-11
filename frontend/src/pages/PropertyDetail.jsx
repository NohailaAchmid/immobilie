import React, { useState, useEffect } from 'react';
import { 
  MapPin, Bed, Bath, Maximize, Heart, Share2, Check, ArrowLeft, 
  Send, Phone, Mail, Calendar, ShieldCheck, Calculator, Sparkles, Building 
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { api } from '../services/api';

export default function PropertyDetail({ propertyId, onBack }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  // Contact form state
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState('');
  const [messageError, setMessageError] = useState('');

  // Loan simulator state
  const [downPayment, setDownPayment] = useState(50000);
  const [loanYears, setLoanYears] = useState(20);
  const [interestRate, setInterestRate] = useState(3.5);

  useEffect(() => {
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [propertyId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.getProperty(propertyId);
      if (res.status === 'success') {
        setProperty(res.data);
        setSelectedImage(res.data.image_url);
        setContactData(prev => ({
          ...prev,
          message: `Bonjour, je suis intéressé(e) par votre bien "${res.data.title}" (Réf: #${res.data.id}). Pouvez-vous me recontacter pour organiser une visite ? Merci.`
        }));
      }
    } catch (err) {
      console.error('Erreur chargement détail bien:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSendingMessage(true);
    setMessageSuccess('');
    setMessageError('');

    try {
      const res = await api.sendMessage({
        property_id: property.id,
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        message: contactData.message,
      });

      if (res.status === 'success') {
        setMessageSuccess('Votre message a bien été envoyé ! Notre agent vous contactera dans les plus brefs délais.');
        setContactData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      setMessageError(err.message || "Erreur lors de l'envoi du message.");
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">Chargement des détails de la propriété...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Bien introuvable</h2>
        <p className="text-slate-500">Cette annonce n'existe pas ou a été retirée du catalogue.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </button>
      </div>
    );
  }

  const favorited = isFavorite(property.id);
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(property.price);

  const isRent = property.status === 'Location';
  const featuresList = property.features ? property.features.split(',').map(f => f.trim()).filter(Boolean) : [];

  // Loan calculation
  const principal = Math.max(0, property.price - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanYears * 12;
  const monthlyPayment = monthlyRate > 0 && principal > 0
    ? Math.round((principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths)))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top action bar: Back button + Favorite & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux annonces</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleFavorite(property)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition ${
              favorited
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{favorited ? 'Enregistré dans vos favoris' : 'Ajouter aux favoris'}</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Lien de l\'annonce copié dans le presse-papier !');
            }}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            title="Partager cette annonce"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title & Price Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
              isRent ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {property.status}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800">
              {property.type}
            </span>
            {Number(property.featured) === 1 && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Coup de Cœur
              </span>
            )}
            <span className="text-xs text-slate-400">Réf. #{property.id}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{property.address ? `${property.address}, ` : ''}{property.city}</span>
          </div>
        </div>

        <div className="text-left lg:text-right">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Prix de présentation</div>
          <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
            {formattedPrice}
            {isRent && <span className="text-base font-normal text-slate-500"> / mois</span>}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Soit environ {Math.round(property.price / (property.surface || 1)).toLocaleString('fr-FR')} € / m²
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="space-y-4">
        {/* Main large picture */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] max-h-[520px] bg-slate-900 shadow-xl">
          <img
            src={selectedImage || property.image_url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails row */}
        {property.gallery && property.gallery.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* Primary thumbnail */}
            <button
              onClick={() => setSelectedImage(property.image_url)}
              className={`relative rounded-xl overflow-hidden w-24 h-16 shrink-0 border-2 transition ${
                selectedImage === property.image_url ? 'border-blue-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={property.image_url} alt="Principal" className="w-full h-full object-cover" />
            </button>

            {/* Gallery thumbnails */}
            {property.gallery.map(img => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.image_url)}
                className={`relative rounded-xl overflow-hidden w-24 h-16 shrink-0 border-2 transition ${
                  selectedImage === img.image_url ? 'border-blue-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.image_url} alt="Photo" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details + Contact Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column (2 cols) : Specs, Description, Amenities, Loan */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <div className="p-3">
              <Maximize className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-slate-900">{property.surface} m²</div>
              <div className="text-xs text-slate-500 font-medium">Surface habitable</div>
            </div>

            <div className="p-3">
              <Building className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-slate-900">{property.rooms}</div>
              <div className="text-xs text-slate-500 font-medium">Pièces</div>
            </div>

            <div className="p-3">
              <Bed className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-slate-900">{property.bedrooms}</div>
              <div className="text-xs text-slate-500 font-medium">Chambres</div>
            </div>

            <div className="p-3">
              <Bath className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-slate-900">{property.bathrooms}</div>
              <div className="text-xs text-slate-500 font-medium">Salles de bain</div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Description du bien</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {property.description}
            </p>
          </div>

          {/* Features / Amenities */}
          {featuresList.length > 0 && (
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Équipements & Prestations</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {featuresList.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loan Calculator (only if sale) */}
          {!isRent && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-7 rounded-3xl shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Simulateur de Mensualité</h3>
                  <p className="text-xs text-slate-300">Estimez votre remboursement de prêt immobilier</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Apport (€)</label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Durée (années)</label>
                  <select
                    value={loanYears}
                    onChange={(e) => setLoanYears(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm"
                  >
                    <option value={15}>15 ans</option>
                    <option value={20}>20 ans</option>
                    <option value={25}>25 ans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Taux estimé (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Mensualité estimée</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                    {monthlyPayment.toLocaleString('fr-FR')} € <span className="text-xs text-slate-400 font-normal">/ mois</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 text-right">
                  Montant emprunté : {principal.toLocaleString('fr-FR')} €
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column : Agent contact card & inquiry form */}
        <div className="space-y-6">
          
          <div className="sticky top-28 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
            
            {/* Agent info snippet */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                alt="Conseiller"
                className="w-14 h-14 rounded-2xl object-cover shadow-md"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-base">Sarah Benali</h4>
                <p className="text-xs text-blue-600 font-semibold">Conseillère Prestige Dédiée</p>
                <p className="text-xs text-slate-400 mt-0.5">+33 (0)1 42 68 50 12</p>
              </div>
            </div>

            {/* Direct inquiry form */}
            <form onSubmit={handleSendMessage} className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Contacter l'agence pour ce bien</h4>

              {messageSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  {messageSuccess}
                </div>
              )}

              {messageError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {messageError}
                </div>
              )}

              <div>
                <input
                  type="text"
                  required
                  placeholder="Votre nom complet"
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Votre adresse email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Numéro de téléphone (optionnel)"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <textarea
                  rows="4"
                  required
                  placeholder="Votre message ou questions..."
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sendingMessage}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{sendingMessage ? 'Envoi en cours...' : 'Envoyer la demande'}</span>
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Vos données restent strictement confidentielles</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
