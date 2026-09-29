import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../context/MovieContext';

export default function Favorites() {
  const { state } = useMovies();
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Your favorites</Typography>
      {state.favorites.length ? <MovieGrid movies={state.favorites} /> : (
        <>
          <Typography color="text.secondary" sx={{ mb: 2 }}>You have not saved any movies yet. Tap the heart on a movie to add it here.</Typography>
          <Button variant="contained" component={RouterLink} to="/">Browse trending movies</Button>
        </>
      )}
    </Container>
  );
}
