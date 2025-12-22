import { TMDB_CONFIG } from './api.config';

// Fetch wrapper with error handling
const fetchTMDB = async (endpoint: string, params?: Record<string, string>) => {
  const url = new URL(`${TMDB_CONFIG.BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('TMDB API Error:', error);
    throw error;
  }
};

// Movie endpoints
export const movieApi = {
  // Get trending movies
  getTrending: async (timeWindow: 'day' | 'week' = 'week') => {
    return fetchTMDB(`/trending/movie/${timeWindow}`);
  },

  // Get popular movies
  getPopular: async (page: number = 1) => {
    return fetchTMDB('/movie/popular', { page: page.toString() });
  },

  // Get now playing movies
  getNowPlaying: async (page: number = 1) => {
    return fetchTMDB('/movie/now_playing', { page: page.toString() });
  },

  // Get top rated movies
  getTopRated: async (page: number = 1) => {
    return fetchTMDB('/movie/top_rated', { page: page.toString() });
  },

  // Get upcoming movies
  getUpcoming: async (page: number = 1) => {
    return fetchTMDB('/movie/upcoming', { page: page.toString() });
  },

  // Get movie details
  getDetails: async (movieId: number) => {
    return fetchTMDB(`/movie/${movieId}`, {
      append_to_response: 'credits,videos,reviews,similar,recommendations',
    });
  },

  // Get movie credits (cast & crew)
  getCredits: async (movieId: number) => {
    return fetchTMDB(`/movie/${movieId}/credits`);
  },

  // Get movie reviews
  getReviews: async (movieId: number, page: number = 1) => {
    return fetchTMDB(`/movie/${movieId}/reviews`, { page: page.toString() });
  },

  // Get similar movies
  getSimilar: async (movieId: number, page: number = 1) => {
    return fetchTMDB(`/movie/${movieId}/similar`, { page: page.toString() });
  },

  // Get movie recommendations
  getRecommendations: async (movieId: number, page: number = 1) => {
    return fetchTMDB(`/movie/${movieId}/recommendations`, { page: page.toString() });
  },

  // Search movies
  search: async (query: string, page: number = 1) => {
    return fetchTMDB('/search/movie', {
      query,
      page: page.toString(),
      include_adult: 'false',
    });
  },

  // Discover movies by genre
  discoverByGenre: async (genreId: number, page: number = 1) => {
    return fetchTMDB('/discover/movie', {
      with_genres: genreId.toString(),
      page: page.toString(),
      sort_by: 'popularity.desc',
    });
  },

  // Get movie genres
  getGenres: async () => {
    return fetchTMDB('/genre/movie/list');
  },
};

// TV Show endpoints (for future use)
export const tvApi = {
  getTrending: async (timeWindow: 'day' | 'week' = 'week') => {
    return fetchTMDB(`/trending/tv/${timeWindow}`);
  },

  getPopular: async (page: number = 1) => {
    return fetchTMDB('/tv/popular', { page: page.toString() });
  },

  getDetails: async (tvId: number) => {
    return fetchTMDB(`/tv/${tvId}`, {
      append_to_response: 'credits,videos,reviews,similar',
    });
  },

  search: async (query: string, page: number = 1) => {
    return fetchTMDB('/search/tv', {
      query,
      page: page.toString(),
    });
  },
};

// Multi search (movies, TV, people)
export const searchAll = async (query: string, page: number = 1) => {
  return fetchTMDB('/search/multi', {
    query,
    page: page.toString(),
    include_adult: 'false',
  });
};
