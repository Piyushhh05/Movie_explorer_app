import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useMovies } from '../context/MovieContext';

export default function Navbar() {
  const { state, dispatch } = useMovies();
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Movie Explorer
        </Typography>
        <Button component={RouterLink} to="/favorites" color="inherit">Favorites ({state.favorites.length})</Button>
        <IconButton color="inherit" aria-label="Toggle light/dark mode" onClick={() => dispatch({ type: 'TOGGLE_MODE' })}>
          {state.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Button color="inherit" onClick={() => dispatch({ type: 'LOGOUT' })}>Log out</Button>
      </Toolbar>
    </AppBar>
  );
}
