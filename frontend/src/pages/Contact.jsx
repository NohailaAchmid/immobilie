import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Send, ShieldCheck, CheckCircle2, 
  HelpCircle, ChevronDown, Building2 
} from 'lucide-react';
import { api } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.sendMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      if (res.status === 'success') {
        setSuccessMsg(res.message);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de l\'envoi.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Comment faire estimer gratuitement mon bien immobilier ?",
      a: "Il vous suffit de nous contacter via le formulaire ci-dessus ou par téléphone. Un expert dédié se déplace gratuitement pour évaluer votre bien avec une étude comparative de marché approfondie."
    },
    {
      q: "Quelles sont les pièces nécessaires pour déposer un dossier de location ?",
      a: "Pour constituer votre dossier, préparez votre pièce d'identité en cours de validité, vos 3 derniers bulletins de salaire, votre dernier avis d'imposition et un justificatif de domicile récent."
    },
    {
      q: "Quels sont vos honoraires d'agence pour la vente ?",
      a: "Nos honoraires sont transparents, dégressifs selon la valeur du bien et fixés en amont dans le mandat de vente exclusif ou simple. Ils comprennent l'ensemble des prestations (photos professionnelles, visites, suivi juridique)."
    },
    {
      q: "Proposez-vous la gestion locative pour les propriétaires bailleurs ?",
      a: "Oui, notre département gestion locative prend en charge la recherche de locataires solvables, les états des lieux, l'encaissement des loyers et la garantie loyers impayés (GLI)."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Nous Sommes à Votre Écoute
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contactez notre agence
        </h1>
        <p className="text-base text-slate-500">
          Une question sur un bien, un projet d'achat, de vente ou d'investissement ? Nos conseillers vous accompagnent de A à Z.
        </p>
      </div>

      {/* Main Grid: Form + Coordinates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Envoyez-nous un message</h2>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean Dupont"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Adresse email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ex: jean.dupont@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                placeholder="Ex: 06 12 34 56 78"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Votre message *
              </label>
              <textarea
                rows="5"
                required
                placeholder="Détaillez votre projet, vos critères de recherche ou vos questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Envoi en cours...' : 'Envoyer mon message'}</span>
            </button>
          </form>
        </div>

        {/* Agency Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Agence Principale
            </h3>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">IMMOPRESTIGE Paris</div>
                  <div>124 Avenue des Champs-Élysées</div>
                  <div>75008 Paris, France</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="font-medium text-white">+33 (0)1 42 68 50 00</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <span>contact@immo-prestige.com</span>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
                <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Horaires d'ouverture</div>
                  <div className="text-xs text-slate-400">Du Lundi au Vendredi : 09h00 - 19h30</div>
                  <div className="text-xs text-slate-400">Samedi : 10h00 - 18h00</div>
                  <div className="text-xs text-slate-400">Dimanche : Sur rendez-vous exclusif</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-blue-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Membre de la Chambre Nationale des Experts Immobiliers</span>
            </div>
          </div>
        </div>

      </div>

      {/* FAQ Section */}
      <div className="pt-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Foire Aux Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Questions fréquemment posées
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
