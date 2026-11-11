import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, Calendar, Trash2, Check, ExternalLink, 
  MessageSquare, User, AlertCircle 
} from 'lucide-react';
import { api } from '../../services/api';

export default function ManageMessages({ onRefreshBadge }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getMessages();
      if (res.status === 'success') {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Erreur chargement messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.markMessageAsRead(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
      if (onRefreshBadge) onRefreshBadge();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    try {
      await api.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      if (onRefreshBadge) onRefreshBadge();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Demandes & Messages Clients</h2>
          <p className="text-xs text-slate-500">
            {messages.filter(m => m.status === 'unread').length} message(s) non lu(s)
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Chargement des messages...</p>
        </div>
      ) : messages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* List column (1 col or 2 cols) */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {messages.map(msg => {
              const isUnread = msg.status === 'unread';
              const isSelected = selectedMessage?.id === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (isUnread) handleMarkAsRead(msg.id);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition text-left ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 shadow-sm'
                      : isUnread
                      ? 'bg-white border-blue-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {msg.name}
                    </span>
                    {isUnread && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold">
                        Nouveau
                      </span>
                    )}
                  </div>

                  {msg.property_title && (
                    <div className="text-[11px] text-blue-600 font-semibold truncate mb-1">
                      Concernant : {msg.property_title}
                    </div>
                  )}

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(msg.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message detail column (2 cols) */}
          <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Header detail */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      {selectedMessage.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                          {selectedMessage.email}
                        </a>
                      </span>
                      {selectedMessage.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`tel:${selectedMessage.phone}`} className="hover:underline">
                            {selectedMessage.phone}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                      title="Supprimer le message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Property banner if associated */}
                {selectedMessage.property_title && (
                  <div className="p-3.5 rounded-xl bg-blue-100/60 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Bien rattaché : </span>
                      <span>{selectedMessage.property_title}</span>
                      {selectedMessage.property_city && <span> ({selectedMessage.property_city})</span>}
                    </div>
                    {selectedMessage.property_price && (
                      <span className="font-extrabold text-blue-700">
                        {Number(selectedMessage.property_price).toLocaleString('fr-FR')} €
                      </span>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message du client :</div>
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Suite à votre demande sur IMMOPRESTIGE${selectedMessage.property_title ? ` - ${selectedMessage.property_title}` : ''}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Répondre par Email</span>
                  </a>

                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Appeler le client</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-24 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-300" />
                <p className="text-sm font-semibold">Sélectionnez un message dans la liste de gauche</p>
                <p className="text-xs text-slate-400">Pour afficher son contenu et y répondre directement</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="py-20 text-center text-slate-400 text-sm">
          Aucun message reçu pour le moment.
        </div>
      )}

    </div>
  );
}
