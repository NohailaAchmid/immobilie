import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Favorites from './pages/Favorites';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [globalFilters, setGlobalFilters] = useState({
    status: 'all',
    type: 'all',
    city: 'all',
    search: '',
  });

  const { isAuthenticated } = useAuth();

  const handleSelectProperty = (property) => {
    setSelectedPropertyId(property.id);
    setCurrentView('property_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (view) => {
    if (view === 'properties_sale') {
      setGlobalFilters(prev => ({ ...prev, status: 'Vente' }));
      setCurrentView('properties');
    } else if (view === 'properties_rent') {
      setGlobalFilters(prev => ({ ...prev, status: 'Location' }));
      setCurrentView('properties');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar currentView={currentView} setCurrentView={handleNav} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <Home
            onSelectProperty={handleSelectProperty}
            setCurrentView={handleNav}
            setGlobalFilters={setGlobalFilters}
          />
        )}

        {currentView === 'properties' && (
          <Properties
            onSelectProperty={handleSelectProperty}
            globalFilters={globalFilters}
            setGlobalFilters={setGlobalFilters}
          />
        )}

        {currentView === 'property_detail' && (
          <PropertyDetail
            propertyId={selectedPropertyId}
            onBack={() => handleNav('properties')}
          />
        )}

        {currentView === 'favorites' && (
          <Favorites
            onSelectProperty={handleSelectProperty}
            setCurrentView={handleNav}
          />
        )}

        {currentView === 'contact' && (
          <Contact />
        )}

        {currentView === 'admin_login' && (
          <AdminLogin
            onLoginSuccess={() => handleNav('admin_dashboard')}
            onBackToSite={() => handleNav('home')}
          />
        )}

        {currentView === 'admin_dashboard' && (
          isAuthenticated ? (
            <Dashboard
              onBackToSite={() => handleNav('home')}
              onViewPublicProperty={(id) => {
                setSelectedPropertyId(id);
                setCurrentView('property_detail');
              }}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={() => handleNav('admin_dashboard')}
              onBackToSite={() => handleNav('home')}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer setCurrentView={handleNav} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  );
}
