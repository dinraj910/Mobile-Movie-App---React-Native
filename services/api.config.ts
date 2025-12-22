// TMDB API Configuration
// Get your API key from https://www.themoviedb.org/settings/api

export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: '17ca234c105353d3f4dfc4d824406bea', // Replace with your TMDB API key
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxN2NhMjM0YzEwNTM1M2QzZjRkZmM0ZDgyNDQwNmJlYSIsIm5iZiI6MTc2NjQxMTgyMi40NzYsInN1YiI6IjY5NDk0ZTJlYzA1NjlkNWNiM2ZiMTYwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WfuWDvQgUmjQJQ2abEZeqr45YzZvco8gXqGJNfXZDGI`, // Replace with your TMDB access token
  },
};

// Image sizes
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
};

// Helper function to build image URL
export const getImageUrl = (
  path: string | null,
  type: 'poster' | 'backdrop' | 'profile' = 'poster',
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string | null => {
  if (!path) return null;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${IMAGE_SIZES[type][size]}${path}`;
};
