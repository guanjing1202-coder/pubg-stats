import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStored = (val) => {
    try {
      const newVal = val instanceof Function ? val(value) : val;
      setValue(newVal);
      window.localStorage.setItem(key, JSON.stringify(newVal));
    } catch {}
  };

  return [value, setStored];
}

// Recent searches: [{ name, platform, time }]
export function useRecentSearches() {
  const [searches, setSearches] = useLocalStorage('pubg_recent_searches', []);

  const addSearch = (name, platform) => {
    setSearches((prev) => {
      const filtered = prev.filter((s) => !(s.name === name && s.platform === platform));
      return [{ name, platform, time: Date.now() }, ...filtered].slice(0, 10);
    });
  };

  const removeSearch = (name, platform) => {
    setSearches((prev) => prev.filter((s) => !(s.name === name && s.platform === platform)));
  };

  const clearSearches = () => setSearches([]);

  return { searches, addSearch, removeSearch, clearSearches };
}

// Favorites: [{ name, platform, addedAt }]
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('pubg_favorites', []);

  const addFavorite = (name, platform) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.name === name && f.platform === platform)) return prev;
      return [{ name, platform, addedAt: Date.now() }, ...prev];
    });
  };

  const removeFavorite = (name, platform) => {
    setFavorites((prev) => prev.filter((f) => !(f.name === name && f.platform === platform)));
  };

  const isFavorite = (name, platform) =>
    favorites.some((f) => f.name === name && f.platform === platform);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
