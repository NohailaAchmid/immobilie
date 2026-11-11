import React from 'react';
import { Building2, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  const handleNav = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1 : Agency presentation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                IMMOPRESTIGE
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Votre agence immobilière de référence pour l'achat, la vente et la location de propriétés haut de gamme et d'exception.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold bg-blue-950/40 p-2.5 rounded-lg border border-blue-900/50">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Garantie financière & Transaction sécurisée</span>
            </div>
          </div>

          {/* Col 2 : Quick links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wide">Nos Prestations</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav('properties_sale')} className="hover:text-blue-400 transition">
                  Biens à la Vente
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('properties_rent')} className="hover:text-blue-400 transition">
                  Biens à la Location
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('properties')} className="hover:text-blue-400 transition">
                  Villas & Maisons de prestige
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('properties')} className="hover:text-blue-400 transition">
                  Penthouses & Appartements
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-blue-400 transition">
                  Estimation de bien immobilier
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 : Contact coordinates */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wide">Coordonnées</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>124 Avenue des Champs-Élysées, 75008 Paris</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                <span>+33 (0)1 42 68 50 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <span>contact@immo-prestige.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Lun - Sam : 09h00 - 19h30</span>
              </li>
            </ul>
          </div>

          {/* Col 4 : Newsletter / Newsletter info */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wide">Newsletter VIP</h4>
            <p className="text-sm mb-4 text-slate-400">
              Recevez en avant-première nos nouvelles annonces confidentielles et opportunités d'investissement.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Merci pour votre inscription à notre newsletter exclusive !'); }} className="space-y-2">
              <input 
                type="email" 
                required 
                placeholder="Votre adresse email..." 
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
              <button 
                type="submit" 
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
              >
                S'inscrire
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} IMMOPRESTIGE. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('admin_login')} className="hover:text-blue-400 transition">
              Administration
            </button>
            <span className="text-slate-800">•</span>
            <span>Mentions Légales</span>
            <span className="text-slate-800">•</span>
            <span>Politique de Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
