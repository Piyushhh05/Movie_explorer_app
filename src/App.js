import { useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useMovies } from './context/MovieContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';

function Protected({ children }) {
  const { state } = useMovies();
  return state.user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { state } = useMovies();
  const theme = useMemo(() => createTheme({ palette: { mode: state.mode } }), [state.mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {state.user && <Navbar />}
      <Routes>
        <Route path="/login" element={state.user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/movie/:id" element={<Protected><MovieDetails /></Protected>} />
        <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
