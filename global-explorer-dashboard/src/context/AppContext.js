import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  theme: 'light',
  favorites: [],
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_FAVORITE':
      const newFavoritesAdd = [...state.favorites, action.payload];
      localStorage.setItem('favorites', JSON.stringify(newFavoritesAdd));
      return { ...state, favorites: newFavoritesAdd };
    case 'REMOVE_FAVORITE':
      const newFavoritesRemove = state.favorites.filter(
        country => country.cca3 !== action.payload
      );
      localStorage.setItem('favorites', JSON.stringify(newFavoritesRemove));
      return { ...state, favorites: newFavoritesRemove };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    dispatch({ type: 'SET_THEME', payload: savedTheme });
    dispatch({ type: 'SET_FAVORITES', payload: savedFavorites });
    
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleFavorite = (country) => {
    const isFavorite = state.favorites.some(fav => fav.cca3 === country.cca3);
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: country.cca3 });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: country });
    }
  };

  const isFavorite = (countryCode) => {
    return state.favorites.some(fav => fav.cca3 === countryCode);
  };

  return (
    <AppContext.Provider value={{
      ...state,
      toggleTheme,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};