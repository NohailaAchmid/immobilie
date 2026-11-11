import React, { useState, useEffect } from 'react';
import { 
  Building2, MessageSquare, Plus, LogOut, ExternalLink, 
  TrendingUp, Home, CheckCircle2, Shield, Layers, Eye 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import ManageProperties from './ManageProperties';
import AddEditProperty from './AddEditProperty';
import ManageMessages from './ManageMessages';

export default function Dashboard({ onBackToSite, onViewPublicProperty }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'add' | 'edit' | 'messages'
  const [editingProperty, setEditingProperty] = useState(null);
  const [stats, setStats] = useState({
    total_properties: 0,
    for_sale: 0,
    for_rent: 0,
    total_messages: 0,
    unread_messages: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.getStats();
      if (res.status === 'success') {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Erreur chargement stats admin:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleEditClick = (prop) => {
    setEditingProperty(prop);
    setActiveTab('edit');
  };

  const handleAddClick = () => {
    setEditingProperty(null);
    setActiveTab('add');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">Panneau d'Administration</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                Connecté
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Bienvenue, {user?.full_name || 'Administrateur'} ({user?.email || 'admin'})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Voir le site public</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs sm:text-sm font-semibold border border-rose-500/30 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Properties */}
        <div 
          onClick={() => setActiveTab('properties')}
          className={`bg-white p-5 rounded-2xl border transition cursor-pointer shadow-sm hover:shadow-md ${
            activeTab === 'properties' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Biens</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.total_properties}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.for_sale} en vente • {stats.for_rent} en location
          </div>
        </div>

        {/* Vente */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">À la Vente</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.for_sale}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Actifs sur la plateforme
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">À la Location</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.for_rent}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Baux d'habitation ou pro
          </div>
        </div>

        {/* Messages */}
        <div 
          onClick={() => setActiveTab('messages')}
          className={`bg-white p-5 rounded-2xl border transition cursor-pointer shadow-sm hover:shadow-md ${
            activeTab === 'messages' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demandes Clients</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-slate-900">{stats.total_messages}</div>
            {stats.unread_messages > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold animate-pulse">
                {stats.unread_messages} non lu(s)
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Messages formulaire & visites
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'properties'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Gérer le catalogue ({stats.total_properties})</span>
        </button>

        <button
          onClick={handleAddClick}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'add'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un nouveau bien</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 relative ${
            activeTab === 'messages'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Demandes reçues</span>
          {stats.unread_messages > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {stats.unread_messages}
            </span>
          )}
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'properties' && (
        <ManageProperties
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onViewPublic={onViewPublicProperty}
        />
      )}

      {activeTab === 'add' && (
        <AddEditProperty
          propertyToEdit={null}
          onSaveSuccess={() => {
            setActiveTab('properties');
            loadStats();
          }}
          onCancel={() => setActiveTab('properties')}
        />
      )}

      {activeTab === 'edit' && (
        <AddEditProperty
          propertyToEdit={editingProperty}
          onSaveSuccess={() => {
            setActiveTab('properties');
            loadStats();
          }}
          onCancel={() => setActiveTab('properties')}
        />
      )}

      {activeTab === 'messages' && (
        <ManageMessages onRefreshBadge={loadStats} />
      )}

    </div>
  );
}
