import React, { useEffect, useState } from 'react';
import { 
  Building2, Sparkles, ShieldCheck, Award, Users, ChevronRight, 
  ArrowRight, CheckCircle2, Star, TrendingUp, Home as HomeIcon, MapPin 
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';
import { api } from '../services/api';

export default function Home({ onSelectProperty, setCurrentView, setGlobalFilters }) {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homeFilters, setHomeFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    city: 'all',
    max_price: '',
  });

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      setLoading(true);
      const res = await api.getProperties({ featured: 1, limit: 6 });
      if (res.status === 'success') {
        setFeaturedProperties(res.data);
        setCities(res.cities || []);
      }
    } catch (err) {
      console.error('Erreur chargement biens vedettes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    setGlobalFilters(prev => ({ ...prev, ...homeFilters }));
    setCurrentView('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (type) => {
    setGlobalFilters(prev => ({ ...prev, type, status: 'all', city: 'all' }));
    setCurrentView('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[620px] flex items-center justify-center pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Maison contemporaine"
            className="w-full h-full object-cover object-center brightness-[0.38] scale-105 transform animate-pulse duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15]">
            Trouvez le lieu où <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-200">
              commence votre histoire
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Découvrez notre sélection exclusive de villas contemporaines, appartements de standing, riads et résidences d'exception.
          </p>

          {/* Filter Bar overlay inside hero */}
          <div className="pt-4 max-w-4xl mx-auto text-left">
            <FilterBar 
              filters={homeFilters} 
              setFilters={setHomeFilters} 
              onSearch={handleSearchSubmit} 
              cities={cities} 
            />
          </div>
        </div>
      </section>

      {/* KPI Stats Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80">
          <div className="text-center p-3 border-r border-slate-100 last:border-r-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-1">98%</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500">Clients satisfaits</div>
          </div>
          <div className="text-center p-3 border-r border-slate-100 last:border-r-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1">1,250+</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500">Biens vendus</div>
          </div>
          <div className="text-center p-3 border-r border-slate-100 last:border-r-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1">15 Ans</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500">D'expérience reconnue</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-1">24h</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500">Réponse sous 24h</div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              Sélection Exclusivité
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Nos Biens à la Une
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Des propriétés d'exception sélectionnées minutieusement par nos experts.
            </p>
          </div>

          <button
            onClick={() => {
              setGlobalFilters({ status: 'all', type: 'all', city: 'all' });
              setCurrentView('properties');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition group self-start sm:self-auto"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-slate-100 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">Aucun bien en vedette pour le moment.</p>
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Explorer par Catégorie
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Chaque projet a son cadre idéal
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Villas & Domaines',
              type: 'Villa',
              image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
              subtitle: 'Espaces généreux et piscines privées'
            },
            {
              title: 'Appartements & Lofts',
              type: 'Appartement',
              image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
              subtitle: 'En plein cœur des métropoles prisées'
            },
            {
              title: 'Riads & Maisons',
              type: 'Riad',
              image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80',
              subtitle: 'Charme authentique et patios raffinés'
            },
            {
              title: 'Bureaux & Commerces',
              type: 'Bureau',
              image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
              subtitle: 'Emplacements stratégiques pour entreprises'
            }
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat.type)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-md hover:shadow-2xl transition duration-500"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl font-bold mb-1 flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                L'Excellence Immobilière
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Pourquoi confier votre projet à IMMOPRESTIGE ?
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Forts de 15 années d'expertise dans les transactions haut de gamme, nous mettons notre réseau international et notre savoir-faire au service de vos ambitions.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: 'Estimation Gratuite & Réaliste',
                    desc: 'Analyse précise basée sur les ventes réelles du marché pour vendre au meilleur prix.'
                  },
                  {
                    title: 'Shooting Photo HD & Visite Virtuelle 3D',
                    desc: 'Mise en valeur optimale de votre bien pour susciter un coup de cœur immédiat.'
                  },
                  {
                    title: 'Accompagnement Juridique & Notarié',
                    desc: 'Suivi rigoureux de toutes les formalités jusqu\'à la signature de l\'acte authentique.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right banner preview */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                  alt="Intérieur luxueux"
                  className="w-full h-[450px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block">
                <div className="flex items-center gap-1 text-amber-300 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300" />
                  ))}
                </div>
                <p className="text-sm font-semibold italic">
                  "Un accompagnement irréprochable du premier rendez-vous à la signature."
                </p>
                <span className="text-xs text-blue-200 mt-2 block font-medium">
                  — Marc & Hélène V., Propriétaires
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 rounded-3xl p-8 sm:p-14 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Vous avez un projet de vente ou d'estimation ?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Bénéficiez des conseils personnalisés de nos conseillers dédiés et d'une valorisation confidentielle sous 48 heures.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl transition transform active:scale-95 shrink-0"
          >
            Prendre rendez-vous
          </button>
        </div>
      </section>

    </div>
  );
}
