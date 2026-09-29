import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: process.env.REACT_APP_TMDB_API_KEY },
});

export const imageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const getTrending = (page = 1) =>
  api.get('/trending/movie/week', { params: { page } }).then((r) => r.data);

export const searchMovies = (query, page = 1) =>
  api.get('/search/movie', { params: { query, page } }).then((r) => r.data);

export const getGenres = () =>
  api.get('/genre/movie/list').then((r) => r.data.genres);

// One call returns details + cast + videos (trailers)
export const getMovie = (id) =>
  api.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } }).then((r) => r.data);

// Convert any axios error into a user-friendly message
export const errorMessage = (e) => {
  if (!process.env.REACT_APP_TMDB_API_KEY) return 'TMDb API key is missing. Add REACT_APP_TMDB_API_KEY to your .env file.';
  if (!e.response) return 'Cannot reach the server. Check your internet connection and try again.';
  if (e.response.status === 401) return 'The TMDb API key is invalid.';
  if (e.response.status === 404) return 'We could not find what you were looking for.';
  if (e.response.status === 429) return 'Too many requests. Please wait a moment and try again.';
  return 'Something went wrong on the server. Please try again later.';
};
