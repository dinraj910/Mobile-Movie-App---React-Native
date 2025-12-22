import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  WISHLIST: '@tmdb_wishlist',
  WATCHED: '@tmdb_watched',
  REVIEWS: '@tmdb_reviews',
};

export interface SavedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  addedAt?: string;
}

export interface UserReview {
  movieId: number;
  title: string;
  poster_path: string;
  rating: number;
  text: string;
  createdAt: string;
}

// Wishlist functions
export const wishlistStorage = {
  getWishlist: async (): Promise<SavedMovie[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  },

  addToWishlist: async (movie: Omit<SavedMovie, 'addedAt'>): Promise<boolean> => {
    try {
      const current = await wishlistStorage.getWishlist();
      if (current.some((m) => m.id === movie.id)) {
        return false; // Already exists
      }
      const updated = [...current, { ...movie, addedAt: new Date().toISOString() }];
      await AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  },

  removeFromWishlist: async (movieId: number): Promise<boolean> => {
    try {
      const current = await wishlistStorage.getWishlist();
      const updated = current.filter((m) => m.id !== movieId);
      await AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  },

  isInWishlist: async (movieId: number): Promise<boolean> => {
    const wishlist = await wishlistStorage.getWishlist();
    return wishlist.some((m) => m.id === movieId);
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.WISHLIST);
  },
};

// Watched movies functions
export const watchedStorage = {
  getWatched: async (): Promise<SavedMovie[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WATCHED);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting watched:', error);
      return [];
    }
  },

  addToWatched: async (movie: Omit<SavedMovie, 'addedAt'>): Promise<boolean> => {
    try {
      const current = await watchedStorage.getWatched();
      if (current.some((m) => m.id === movie.id)) {
        return false; // Already exists
      }
      const updated = [...current, { ...movie, addedAt: new Date().toISOString() }];
      await AsyncStorage.setItem(STORAGE_KEYS.WATCHED, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error adding to watched:', error);
      return false;
    }
  },

  removeFromWatched: async (movieId: number): Promise<boolean> => {
    try {
      const current = await watchedStorage.getWatched();
      const updated = current.filter((m) => m.id !== movieId);
      await AsyncStorage.setItem(STORAGE_KEYS.WATCHED, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error removing from watched:', error);
      return false;
    }
  },

  isWatched: async (movieId: number): Promise<boolean> => {
    const watched = await watchedStorage.getWatched();
    return watched.some((m) => m.id === movieId);
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.WATCHED);
  },
};

// User reviews functions
export const reviewStorage = {
  getAllReviews: async (): Promise<UserReview[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  },

  saveReview: async (movieId: number, rating: number, text: string, title?: string, poster_path?: string): Promise<boolean> => {
    try {
      const current = await reviewStorage.getAllReviews();
      const existingIndex = current.findIndex((r) => r.movieId === movieId);
      
      const review: UserReview = {
        movieId,
        title: title || '',
        poster_path: poster_path || '',
        rating,
        text,
        createdAt: new Date().toISOString(),
      };
      
      if (existingIndex >= 0) {
        // Preserve existing title and poster if not provided
        review.title = title || current[existingIndex].title;
        review.poster_path = poster_path || current[existingIndex].poster_path;
        current[existingIndex] = review;
      } else {
        current.push(review);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(current));
      return true;
    } catch (error) {
      console.error('Error saving review:', error);
      return false;
    }
  },

  getReview: async (movieId: number): Promise<{ rating: number; text: string } | null> => {
    const reviews = await reviewStorage.getAllReviews();
    const review = reviews.find((r) => r.movieId === movieId);
    return review ? { rating: review.rating, text: review.text } : null;
  },

  deleteReview: async (movieId: number): Promise<boolean> => {
    try {
      const current = await reviewStorage.getAllReviews();
      const updated = current.filter((r) => r.movieId !== movieId);
      await AsyncStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.REVIEWS);
  },
};
