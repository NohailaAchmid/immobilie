import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('immo_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('immo_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = (property) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === property.id);
      if (exists) {
        return prev.filter(item => item.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  const isFavorite = (id) => {
    return favorites.some(item => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, favoritesCount: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
