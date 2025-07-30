import { useState, useEffect, useCallback } from 'react';
import { favoritesStorage } from '../utils/storage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from storage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = favoritesStorage.getFavorites();
        setFavorites(storedFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Add contact to favorites
  const addToFavorites = useCallback((contactId) => {
    try {
      if (!favorites.includes(contactId)) {
        const updatedFavorites = [...favorites, contactId];
        favoritesStorage.setFavorites(updatedFavorites);
        setFavorites(updatedFavorites);
        return { success: true };
      }
      return { success: false, error: 'Contact already in favorites' };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, error: 'Failed to add to favorites' };
    }
  }, [favorites]);

  // Remove contact from favorites
  const removeFromFavorites = useCallback((contactId) => {
    try {
      const updatedFavorites = favorites.filter(id => id !== contactId);
      favoritesStorage.setFavorites(updatedFavorites);
      setFavorites(updatedFavorites);
      return { success: true };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { success: false, error: 'Failed to remove from favorites' };
    }
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((contactId) => {
    if (favorites.includes(contactId)) {
      return removeFromFavorites(contactId);
    } else {
      return addToFavorites(contactId);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  // Check if contact is favorite
  const isFavorite = useCallback((contactId) => {
    return favorites.includes(contactId);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    try {
      favoritesStorage.setFavorites([]);
      setFavorites([]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return { success: false, error: 'Failed to clear favorites' };
    }
  }, []);

  // Get favorite count
  const getFavoriteCount = useCallback(() => {
    return favorites.length;
  }, [favorites]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    getFavoriteCount
  };
}; 