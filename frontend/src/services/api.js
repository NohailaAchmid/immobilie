/**
 * Service API pour la communication avec le backend PHP Native
 */

// Détection automatique et robuste de l'URL du backend PHP
export const API_BASE_URL = (() => {
  // 1. Variable d'environnement explicite
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. En environnement de développement (Vite sur port 5173, 5174, 5175, etc.)
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isDevPort = window.location.port && window.location.port !== '80' && window.location.port !== '8000';
    if (isLocalhost && isDevPort) {
      return 'http://localhost:8000/api';
    }
  }

  // 3. Fallback relatif (Apache XAMPP / production)
  return '/api';
})();

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    ...options.headers,
  };

  // Si le body n'est pas un FormData, on ajoute application/json
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || (
        res.status === 404 
          ? `Point d'accès introuvable (404 sur ${url}). Vérifiez que le serveur PHP est bien démarré sur http://localhost:8000.`
          : `Erreur serveur (${res.status})`
      );
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`Erreur API [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Biens immobiliers
  getProperties: async (filters = {}) => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/properties/read.php${queryString}`);
  },

  getProperty: async (id) => {
    return request(`/properties/read_single.php?id=${id}`);
  },

  createProperty: async (formDataOrObj) => {
    const isFormData = formDataOrObj instanceof FormData;
    return request('/properties/create.php', {
      method: 'POST',
      body: isFormData ? formDataOrObj : JSON.stringify(formDataOrObj),
    });
  },

  updateProperty: async (formDataOrObj) => {
    const isFormData = formDataOrObj instanceof FormData;
    return request('/properties/update.php', {
      method: 'POST',
      body: isFormData ? formDataOrObj : JSON.stringify(formDataOrObj),
    });
  },

  deleteProperty: async (id) => {
    return request('/properties/delete.php', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  // Messages / Contact
  sendMessage: async (messageData) => {
    return request('/messages/create.php', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getMessages: async () => {
    return request('/messages/read.php');
  },

  markMessageAsRead: async (id) => {
    return request('/messages/update_status.php', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  deleteMessage: async (id) => {
    return request('/messages/delete.php', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  // Statistiques Dashboard
  getStats: async () => {
    return request('/stats/index.php');
  },

  // Authentification
  login: async (username, password) => {
    return request('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};
