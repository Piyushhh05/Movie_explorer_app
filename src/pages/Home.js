import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, CircularProgress, Container, MenuItem, TextField, Typography } from '@mui/material';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import { errorMessage, getGenres, getTrending, searchMovies } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

export default function Home() {
  const { state, dispatch } = useMovies();
  const [query, setQuery] = useState(state.lastSearch); // restored from localStorage
  const [debounced, setDebounced] = useState(query);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });
  const sentinel = useRef(null);
  const requestId = useRef(0); // ignore stale responses

  // Debounce typing
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 500);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    getGenres().then(setGenres).catch(() => {}); // filters are optional; fail silently
  }, []);

  const load = useCallback(async (q, p) => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const data = q ? await searchMovies(q, p) : await getTrending(p);
      if (id !== requestId.current) return;
      setItems((prev) => (p === 1 ? data.results : [...prev, ...data.results]));
      setPage(p);
      setTotalPages(data.total_pages);
    } catch (e) {
      if (id === requestId.current) setError(errorMessage(e));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // New query -> reset and load page 1; remember last search
  useEffect(() => {
    dispatch({ type: 'SET_LAST_SEARCH', query: debounced });
    setItems([]);
    load(debounced, 1);
  }, [debounced, load, dispatch]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading && !error && page > 0 && page < totalPages) load(debounced, page + 1);
    }, { rootMargin: '300px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading, error, page, totalPages, debounced, load]);

  // Client-side filters (bonus) applied to the loaded results
  const visible = items.filter((m) =>
    (!filters.genre || m.genre_ids?.includes(Number(filters.genre))) &&
    (!filters.year || (m.release_date || '').startsWith(filters.year)) &&
    (!filters.rating || m.vote_average >= Number(filters.rating))
  );
  const setFilter = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Container sx={{ py: 3 }}>
      <SearchBar value={query} onChange={setQuery} />
      <Box sx={{ display: 'flex', gap: 2, my: 2, flexWrap: 'wrap' }}>
        <TextField select size="small" label="Genre" value={filters.genre} onChange={setFilter('genre')} sx={{ minWidth: 140 }}>
          <MenuItem value="">All</MenuItem>
          {genres.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Year" placeholder="e.g. 2023" value={filters.year} onChange={setFilter('year')} inputProps={{ maxLength: 4 }} sx={{ width: 110 }} />
        <TextField select size="small" label="Min rating" value={filters.rating} onChange={setFilter('rating')} sx={{ minWidth: 130 }}>
          <MenuItem value="">Any</MenuItem>
          {[5, 6, 7, 8].map((r) => <MenuItem key={r} value={r}>{r}+</MenuItem>)}
        </TextField>
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>{debounced ? `Results for "${debounced}"` : 'Trending this week'}</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && visible.length === 0 && (
        <Typography color="text.secondary">No movies found. Try a different search or clear the filters.</Typography>
      )}
      <MovieGrid movies={visible} />
      <Box ref={sentinel} sx={{ height: 40, display: 'grid', placeItems: 'center', mt: 2 }}>
        {loading && <CircularProgress size={28} />}
      </Box>
    </Container>
  );
}
