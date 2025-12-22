import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { icons } from '@/constants/icons';
import { RatingCircle } from '@/components';
import { movieApi, getImageUrl, wishlistStorage, watchedStorage, reviewStorage } from '@/services';

const { width } = Dimensions.get('window');

const MovieDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // State
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<{ cast: Cast[] }>({ cast: [] });
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // User Actions State
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [userReview, setUserReview] = useState<{ rating: number; text: string } | null>(null);
  
  // Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(7);
  const [reviewText, setReviewText] = useState('');

  // Fetch movie data
  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [movieDetails, movieCredits, similar, movieReviews] = await Promise.all([
          movieApi.getDetails(Number(id)),
          movieApi.getCredits(Number(id)),
          movieApi.getSimilar(Number(id)),
          movieApi.getReviews(Number(id)),
        ]);
        
        setMovie(movieDetails);
        setCredits(movieCredits);
        setSimilarMovies(similar.results.slice(0, 10));
        setReviews(movieReviews.results.slice(0, 5));
        
        // Check user status
        const [inWishlist, watched, savedReview] = await Promise.all([
          wishlistStorage.isInWishlist(Number(id)),
          watchedStorage.isWatched(Number(id)),
          reviewStorage.getReview(Number(id)),
        ]);
        
        setIsInWishlist(inWishlist);
        setIsWatched(watched);
        setUserReview(savedReview);
        
        if (savedReview) {
          setReviewRating(savedReview.rating);
          setReviewText(savedReview.text);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        Alert.alert('Error', 'Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieData();
  }, [id]);

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!movie) return;
    
    try {
      if (isInWishlist) {
        await wishlistStorage.removeFromWishlist(movie.id);
        setIsInWishlist(false);
      } else {
        await wishlistStorage.addToWishlist({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Handle watched toggle
  const handleWatchedToggle = async () => {
    if (!movie) return;
    
    try {
      if (isWatched) {
        await watchedStorage.removeFromWatched(movie.id);
        setIsWatched(false);
      } else {
        await watchedStorage.addToWatched({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        });
        setIsWatched(true);
        
        // Ask to write a review after marking as watched
        Alert.alert(
          'Movie Watched!',
          'Would you like to write a review?',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Write Review', onPress: () => setShowReviewModal(true) },
          ]
        );
      }
    } catch (error) {
      console.error('Error updating watched:', error);
    }
  };

  // Handle save review
  const handleSaveReview = async () => {
    if (!movie) return;
    
    try {
      await reviewStorage.saveReview(movie.id, reviewRating, reviewText, movie.title, movie.poster_path || '');
      setUserReview({ rating: reviewRating, text: reviewText });
      setShowReviewModal(false);
      Alert.alert('Success', 'Your review has been saved!');
    } catch (error) {
      console.error('Error saving review:', error);
      Alert.alert('Error', 'Failed to save review');
    }
  };

  // Handle delete review
  const handleDeleteReview = async () => {
    if (!movie) return;
    
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete your review?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await reviewStorage.deleteReview(movie.id);
            setUserReview(null);
            setReviewRating(7);
            setReviewText('');
          }
        },
      ]
    );
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount: number) => {
    if (amount === 0) return 'N/A';
    return `$${(amount / 1000000).toFixed(0)}M`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <View className="flex-1 bg-dark-200 items-center justify-center">
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ActivityIndicator size="large" color="#01B4E4" />
        <Text className="text-light-300 mt-4">Loading movie details...</Text>
      </View>
    );
  }

  // Error State
  if (!movie) {
    return (
      <View className="flex-1 bg-dark-200 items-center justify-center px-4">
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Text className="text-light-100 text-xl font-bold">Movie not found</Text>
        <TouchableOpacity 
          className="bg-primary px-6 py-3 rounded-full mt-4"
          onPress={() => router.back()}
        >
          <Text className="text-dark-100 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-200">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Backdrop Image */}
        <View className="relative">
          <Image
            source={{ uri: getImageUrl(movie.backdrop_path, 'backdrop', 'large') || undefined }}
            style={{ width, height: 280 }}
            resizeMode="cover"
            className="bg-dark-300"
          />
          
          {/* Gradient Overlay */}
          <View className="absolute inset-0 bg-gradient-to-t from-dark-200 to-transparent" />
          <View className="absolute bottom-0 left-0 right-0 h-32 bg-dark-200" style={{ opacity: 0.9 }} />
          
          {/* Back Button */}
          <TouchableOpacity 
            className="absolute top-12 left-4 bg-dark-200/80 p-2 rounded-full"
            onPress={() => router.back()}
          >
            <Image 
              source={icons.arrow}
              className="w-6 h-6"
              tintColor="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Action Buttons - Top Right */}
          <View className="absolute top-12 right-4 flex-row">
            {/* Watched Button */}
            <TouchableOpacity 
              className={`p-2 rounded-full mr-2 ${isWatched ? 'bg-accent' : 'bg-dark-200/80'}`}
              onPress={handleWatchedToggle}
            >
              <Image 
                source={icons.star}
                className="w-6 h-6"
                tintColor={isWatched ? '#0D253F' : '#FFFFFF'}
              />
            </TouchableOpacity>
            
            {/* Wishlist Button */}
            <TouchableOpacity 
              className={`p-2 rounded-full ${isInWishlist ? 'bg-secondary' : 'bg-dark-200/80'}`}
              onPress={handleWishlistToggle}
            >
              <Image 
                source={icons.save}
                className="w-6 h-6"
                tintColor={isInWishlist ? '#0D253F' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Movie Info Section */}
        <View className="px-4 -mt-20 relative z-10">
          <View className="flex-row">
            {/* Poster */}
            <Image
              source={{ uri: getImageUrl(movie.poster_path, 'poster', 'medium') || undefined }}
              className="w-32 h-48 rounded-xl bg-dark-300"
              resizeMode="cover"
            />
            
            {/* Info */}
            <View className="flex-1 ml-4 pt-8">
              <Text className="text-light-100 text-xl font-bold" numberOfLines={2}>
                {movie.title}
              </Text>
              {movie.tagline && (
                <Text className="text-light-300 text-sm italic mt-1">
                  &ldquo;{movie.tagline}&rdquo;
                </Text>
              )}
              
              {/* Meta Info */}
              <View className="flex-row items-center mt-3 flex-wrap">
                <Text className="text-light-300 text-sm">
                  {new Date(movie.release_date).getFullYear()}
                </Text>
                {movie.runtime > 0 && (
                  <>
                    <View className="w-1 h-1 bg-light-300 rounded-full mx-2" />
                    <Text className="text-light-300 text-sm">
                      {formatRuntime(movie.runtime)}
                    </Text>
                  </>
                )}
              </View>

              {/* Rating */}
              <View className="flex-row items-center mt-3">
                <RatingCircle rating={movie.vote_average} size="small" />
                <Text className="text-light-300 text-sm ml-2">
                  {movie.vote_count.toLocaleString()} votes
                </Text>
              </View>
            </View>
          </View>

          {/* Genres */}
          <View className="flex-row flex-wrap mt-4">
            {movie.genres?.map((genre) => (
              <View 
                key={genre.id}
                className="bg-dark-300 px-3 py-1.5 rounded-full mr-2 mb-2"
              >
                <Text className="text-primary text-sm">{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* User Action Buttons */}
          <View className="flex-row mt-6">
            <TouchableOpacity 
              className={`flex-1 py-3 rounded-xl flex-row items-center justify-center mr-2 ${
                isWatched ? 'bg-accent' : 'bg-dark-300'
              }`}
              onPress={handleWatchedToggle}
            >
              <Image 
                source={icons.star}
                className="w-5 h-5 mr-2"
                tintColor={isWatched ? '#0D253F' : '#FFFFFF'}
              />
              <Text className={`font-bold ${isWatched ? 'text-dark-100' : 'text-light-100'}`}>
                {isWatched ? 'Watched ✓' : 'Mark Watched'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                isInWishlist ? 'bg-secondary' : 'bg-primary'
              }`}
              onPress={handleWishlistToggle}
            >
              <Image 
                source={icons.save}
                className="w-5 h-5 mr-2"
                tintColor="#0D253F"
              />
              <Text className="text-dark-100 font-bold">
                {isInWishlist ? 'In Wishlist ✓' : 'Add to Wishlist'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* User Review Section */}
          <View className="mt-6 bg-dark-300 rounded-xl p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-light-100 text-lg font-bold">Your Review</Text>
              {userReview && (
                <TouchableOpacity onPress={handleDeleteReview}>
                  <Text className="text-red-500 text-sm">Delete</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {userReview ? (
              <TouchableOpacity onPress={() => setShowReviewModal(true)}>
                <View className="flex-row items-center mb-2">
                  {[...Array(10)].map((_, i) => (
                    <Image
                      key={i}
                      source={icons.star}
                      className="w-4 h-4 mr-0.5"
                      tintColor={i < userReview.rating ? '#FFD700' : '#4B5563'}
                    />
                  ))}
                  <Text className="text-light-100 ml-2">{userReview.rating}/10</Text>
                </View>
                {userReview.text ? (
                  <Text className="text-light-300 text-sm">{userReview.text}</Text>
                ) : (
                  <Text className="text-light-300 text-sm italic">No written review. Tap to edit.</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => setShowReviewModal(true)}
              >
                <View className="flex-row">
                  {[...Array(10)].map((_, i) => (
                    <Image
                      key={i}
                      source={icons.star}
                      className="w-4 h-4 mr-0.5"
                      tintColor="#4B5563"
                    />
                  ))}
                </View>
                <Text className="text-primary text-sm ml-2">Tap to rate</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Overview */}
          <View className="mt-6">
            <Text className="text-light-100 text-lg font-bold mb-3">Overview</Text>
            <Text className="text-light-300 text-base leading-6">
              {movie.overview || 'No overview available.'}
            </Text>
          </View>

          {/* Cast */}
          {credits.cast.length > 0 && (
            <View className="mt-6">
              <Text className="text-light-100 text-lg font-bold mb-3">Top Cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {credits.cast.slice(0, 10).map((actor) => (
                  <View key={actor.id} className="mr-4 items-center" style={{ width: 70 }}>
                    <Image
                      source={{ uri: getImageUrl(actor.profile_path, 'profile', 'small') || undefined }}
                      className="w-16 h-16 rounded-full bg-dark-300"
                      resizeMode="cover"
                    />
                    <Text className="text-light-100 text-xs font-medium mt-2 text-center" numberOfLines={2}>
                      {actor.name}
                    </Text>
                    <Text className="text-light-300 text-xs text-center" numberOfLines={1}>
                      {actor.character?.split('/')[0]}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* TMDB Reviews */}
          {reviews.length > 0 && (
            <View className="mt-6">
              <Text className="text-light-100 text-lg font-bold mb-3">Reviews</Text>
              {reviews.map((review) => (
                <View key={review.id} className="bg-dark-300 rounded-xl p-4 mb-3">
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-3">
                      <Text className="text-dark-100 font-bold">
                        {review.author.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-light-100 font-semibold">{review.author}</Text>
                      {review.author_details?.rating && (
                        <View className="flex-row items-center">
                          <Image source={icons.star} className="w-3 h-3 mr-1" tintColor="#FFD700" />
                          <Text className="text-light-300 text-sm">
                            {review.author_details.rating}/10
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text className="text-light-300 text-sm" numberOfLines={4}>
                    {review.content}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Movie Stats */}
          <View className="mt-6 bg-dark-300 rounded-xl p-4">
            <Text className="text-light-100 text-lg font-bold mb-4">Movie Info</Text>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-light-300">Status</Text>
              <Text className="text-light-100">{movie.status}</Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-light-300">Release Date</Text>
              <Text className="text-light-100">{formatDate(movie.release_date)}</Text>
            </View>
            
            {movie.budget > 0 && (
              <View className="flex-row justify-between mb-3">
                <Text className="text-light-300">Budget</Text>
                <Text className="text-light-100">{formatMoney(movie.budget)}</Text>
              </View>
            )}
            
            {movie.revenue > 0 && (
              <View className="flex-row justify-between mb-3">
                <Text className="text-light-300">Revenue</Text>
                <Text className="text-accent">{formatMoney(movie.revenue)}</Text>
              </View>
            )}
            
            {movie.production_companies?.length > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-light-300">Production</Text>
                <Text className="text-light-100 text-right flex-1 ml-4" numberOfLines={2}>
                  {movie.production_companies.map(c => c.name).join(', ')}
                </Text>
              </View>
            )}
          </View>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <View className="mt-6">
              <Text className="text-light-100 text-lg font-bold mb-3">Similar Movies</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similarMovies.map((similarMovie) => (
                  <TouchableOpacity 
                    key={similarMovie.id}
                    className="mr-3"
                    onPress={() => router.push(`/movies/${similarMovie.id}`)}
                  >
                    <Image
                      source={{ uri: getImageUrl(similarMovie.poster_path, 'poster', 'small') || undefined }}
                      className="w-28 h-40 rounded-xl bg-dark-300"
                      resizeMode="cover"
                    />
                    <Text className="text-light-100 text-sm font-medium mt-2 w-28" numberOfLines={1}>
                      {similarMovie.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Image source={icons.star} className="w-3 h-3 mr-1" tintColor="#FFD700" />
                      <Text className="text-light-300 text-xs">
                        {similarMovie.vote_average?.toFixed(1)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Bottom Spacing */}
          <View className="h-8" />
        </View>
      </ScrollView>

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-dark-200 rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-light-100 text-xl font-bold">Rate & Review</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Text className="text-light-300 text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Rating Stars */}
            <Text className="text-light-300 text-sm mb-2">Your Rating</Text>
            <View className="flex-row justify-center mb-6">
              {[...Array(10)].map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setReviewRating(i + 1)}
                  className="p-1"
                >
                  <Image
                    source={icons.star}
                    className="w-8 h-8"
                    tintColor={i < reviewRating ? '#FFD700' : '#4B5563'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-center text-light-100 text-2xl font-bold mb-6">
              {reviewRating}/10
            </Text>

            {/* Review Text */}
            <Text className="text-light-300 text-sm mb-2">Your Review (Optional)</Text>
            <TextInput
              className="bg-dark-300 rounded-xl p-4 text-light-100 min-h-24"
              multiline
              placeholder="Write your thoughts about the movie..."
              placeholderTextColor="#6B7280"
              value={reviewText}
              onChangeText={setReviewText}
              textAlignVertical="top"
            />

            {/* Save Button */}
            <TouchableOpacity
              className="bg-primary py-4 rounded-xl mt-6"
              onPress={handleSaveReview}
            >
              <Text className="text-dark-100 text-center font-bold text-lg">
                Save Review
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MovieDetails;