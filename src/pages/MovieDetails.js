import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Chip, CircularProgress, Container, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { errorMessage, getMovie, imageUrl } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useMovies();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setMovie(null);
    setError('');
    getMovie(id).then(setMovie).catch((e) => setError(errorMessage(e)));
  }, [id]);

  if (error) return <Container sx={{ py: 3 }}><Alert severity="error">{error}</Alert><Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go back</Button></Container>;
  if (!movie) return <Box sx={{ display: 'grid', placeItems: 'center', py: 10 }}><CircularProgress /></Box>;

  const isFav = state.favorites.some((m) => m.id === movie.id);
  const trailer = movie.videos?.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const cast = movie.credits?.cast.slice(0, 10) || [];

  return (
    <Container sx={{ py: 3 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box component="img" src={imageUrl(movie.poster_path) || 'https://placehold.co/500x750?text=No+Poster'} alt={movie.title}
          sx={{ width: { xs: '100%', md: 300 }, maxWidth: 300, alignSelf: { xs: 'center', md: 'flex-start' }, borderRadius: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">{movie.title} {movie.release_date && `(${movie.release_date.slice(0, 4)})`}</Typography>
          {movie.tagline && <Typography color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>{movie.tagline}</Typography>}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
            {movie.genres.map((g) => <Chip key={g.id} label={g.name} />)}
          </Box>
          <Typography sx={{ mb: 1 }}>Rating: {movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10` : 'N/A'}{movie.runtime ? ` | ${movie.runtime} min` : ''}</Typography>
          <Typography variant="h6">Overview</Typography>
          <Typography sx={{ mb: 2 }}>{movie.overview || 'No overview available.'}</Typography>
          <Typography variant="h6">Cast</Typography>
          <Typography sx={{ mb: 2 }}>{cast.length ? cast.map((c) => c.name).join(', ') : 'Cast information is not available.'}</Typography>
          <Button variant={isFav ? 'outlined' : 'contained'} startIcon={isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', movie: { id: movie.id, title: movie.title, poster_path: movie.poster_path, release_date: movie.release_date, vote_average: movie.vote_average, genre_ids: movie.genres.map((g) => g.id) } })}>
            {isFav ? 'Remove from favorites' : 'Add to favorites'}
          </Button>
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Trailer</Typography>
      {trailer ? (
        <Box sx={{ position: 'relative', pt: '56.25%', maxWidth: 900 }}>
          <iframe title={`${movie.title} trailer`} src={`https://www.youtube.com/embed/${trailer.key}`} allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
        </Box>
      ) : <Typography color="text.secondary">No trailer available for this movie.</Typography>}
    </Container>
  );
}
