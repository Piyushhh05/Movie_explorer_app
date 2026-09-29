# 📌Movie Explorer

A React web app to search movies, browse trending films and view details, powered by the TMDb API.

## Features
- Login screen (mock auth, see Notes) with protected routes
- Search bar (debounced) with a poster grid: title, release year, rating
- Trending movies section (default view)
- Movie details page: overview, genres, runtime, cast, YouTube trailer embed
- Infinite scrolling for search and trending results (IntersectionObserver)
- Light / dark mode (persisted)
- Favorites list and last searched movie, both persisted in localStorage
- Filters by genre, year and minimum rating (bonus)
- User-friendly error messages (missing key, network down, rate limit, 404)
- Mobile-first responsive layout with Material-UI

## Tech stack
React (Create React App), React Router v6, Context API + useReducer, axios, Material-UI v5.

## Setup
1. `git clone <repo-url> && cd movie-explorer`
2. `npm install`
3. Create a free TMDb account and copy your **API Key (v3 auth)**.
4. `cp .env.example .env` and set `REACT_APP_TMDB_API_KEY=<your key>`
5. `npm start` (http://localhost:3000)

## API usage (TMDb v3)
| Purpose | Endpoint |
|---|---|
| Trending | `GET /trending/movie/week` |
| Search | `GET /search/movie?query=&page=` |
| Details + cast + trailers | `GET /movie/{id}?append_to_response=videos,credits` |
| Genre list (filters) | `GET /genre/movie/list` |

## Project structure
```
src/api/tmdb.js            axios client, endpoints, error messages
src/context/MovieContext.js  global state (user, theme, favorites, last search)
src/components/            Navbar, SearchBar, MovieCard, MovieGrid
src/pages/                 Login, Home, MovieDetails, Favorites
```

## Notes and limitations
- Login is a front-end mock: any username plus a 4+ character password works. There is no backend.
- Filters apply to results already loaded (TMDb search does not support genre/rating filters), so scroll to load more matches.
- The "Load More" button bonus was not implemented; infinite scroll is used instead.
- The API key is bundled into the client build, which is normal for TMDb v3 keys but means it is visible to users.
