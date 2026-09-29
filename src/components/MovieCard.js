import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { imageUrl } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

const PLACEHOLDER = 'https://placehold.co/500x750?text=No+Poster';

export default function MovieCard({ movie }) {
  const { state, dispatch } = useMovies();
  const isFav = state.favorites.some((m) => m.id === movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <IconButton
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', movie })}
        sx={{ position: 'absolute', top: 4, right: 4, zIndex: 1, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
      >
        {isFav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
      <CardActionArea component={RouterLink} to={`/movie/${movie.id}`}>
        <CardMedia component="img" image={imageUrl(movie.poster_path) || PLACEHOLDER} alt={movie.title} sx={{ aspectRatio: '2/3', objectFit: 'cover' }} loading="lazy" />
        <CardContent>
          <Typography variant="subtitle1" noWrap title={movie.title}>{movie.title}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
            <Typography variant="body2">{year}</Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon fontSize="inherit" sx={{ color: 'gold', mr: 0.5 }} />{rating}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
