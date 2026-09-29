import { createContext, useContext, useEffect, useReducer } from 'react';

const MovieContext = createContext(null);

const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

const initialState = () => ({
  user: read('me_user', null),
  mode: read('me_mode', 'light'),
  favorites: read('me_favorites', []),
  lastSearch: read('me_lastSearch', ''),
});

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'TOGGLE_MODE':
      return { ...state, mode: state.mode === 'light' ? 'dark' : 'light' };
    case 'SET_LAST_SEARCH':
      return { ...state, lastSearch: action.query };
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.some((m) => m.id === action.movie.id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((m) => m.id !== action.movie.id)
          : [...state.favorites, action.movie],
      };
    }
    default:
      return state;
  }
}

export function MovieProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // Persist to localStorage whenever these change
  useEffect(() => {
    try {
      localStorage.setItem('me_user', JSON.stringify(state.user));
      localStorage.setItem('me_mode', JSON.stringify(state.mode));
      localStorage.setItem('me_favorites', JSON.stringify(state.favorites));
      localStorage.setItem('me_lastSearch', JSON.stringify(state.lastSearch));
    } catch { /* storage unavailable; app still works in memory */ }
  }, [state]);

  return <MovieContext.Provider value={{ state, dispatch }}>{children}</MovieContext.Provider>;
}

export const useMovies = () => useContext(MovieContext);
