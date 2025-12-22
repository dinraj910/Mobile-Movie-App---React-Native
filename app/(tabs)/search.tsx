import { 
  View, 
  Text, 
  FlatList, 
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator 
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components';
import { icons } from '@/constants/icons';
import { useLocalSearchParams, router } from 'expo-router';
import { movieApi, getImageUrl } from '@/services';

const Search = () => {
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.query as string || '');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchTrendingMovies();
    // If query param exists, search immediately
    if (params.query) {
      const initialQuery = params.query as string;
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrendingMovies = async () => {
    try {
      const data = await movieApi.getTrending('day');
      setTrendingMovies(data.results?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    setPage(1);
    
    try {
      const data = await movieApi.search(query, 1);
      setResults(data.results || []);
      setTotalResults(data.total_results || 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = useCallback(async () => {
    performSearch(searchQuery);
  }, [searchQuery]);

  const loadMoreResults = async () => {
    if (isSearching || results.length >= totalResults) return;
    
    try {
      const nextPage = page + 1;
      const data = await movieApi.search(searchQuery, nextPage);
      setResults([...results, ...(data.results || [])]);
      setPage(nextPage);
    } catch (error) {
      console.error('Load more error:', error);
    }
  };

  const handleMoviePress = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  const handleTrendingSearch = async (title: string) => {
    setSearchQuery(title);
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const data = await movieApi.search(title, 1);
      setResults(data.results || []);
      setTotalResults(data.total_results || 0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setResults([]);
  };

  return (
    <View className="flex-1 bg-dark-200">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-4">
          <Text className="text-light-100 text-2xl font-bold">Search</Text>
          <Text className="text-light-300 text-sm mt-1">
            Find movies, TV shows, and more
          </Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Search movies, TV shows..."
        />

        {/* Content */}
        <View className="flex-1 mt-4">
          {!hasSearched ? (
            // Show Trending Movies
            <View className="px-4">
              {/* Trending Searches from API */}
              <Text className="text-light-100 text-lg font-semibold mb-4">
                🔥 Trending Now
              </Text>
              {trendingMovies.map((movie, index) => (
                <TouchableOpacity
                  key={movie.id}
                  onPress={() => handleMoviePress(movie.id)}
                  className="flex-row items-center py-3 border-b border-dark-300"
                >
                  <Text className="text-primary text-lg font-bold mr-3 w-6">
                    {index + 1}
                  </Text>
                  <Image
                    source={{ uri: getImageUrl(movie.poster_path, 'poster', 'small') || undefined }}
                    className="w-12 h-16 rounded-lg bg-dark-300 mr-3"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-light-100 text-base font-medium" numberOfLines={1}>
                      {movie.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Image source={icons.star} className="w-3 h-3 mr-1" tintColor="#FFD700" />
                      <Text className="text-light-300 text-sm">
                        {movie.vote_average?.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  <Image 
                    source={icons.arrow}
                    className="w-4 h-4"
                    tintColor="#9CA3AF"
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </TouchableOpacity>
              ))}

              {/* Quick Search Suggestions */}
              <Text className="text-light-100 text-lg font-semibold mt-6 mb-4">
                Popular Searches
              </Text>
              <View className="flex-row flex-wrap">
                {['Action', 'Comedy', 'Horror', 'Sci-Fi', 'Drama', 'Animation'].map((term) => (
                  <TouchableOpacity
                    key={term}
                    onPress={() => handleTrendingSearch(term)}
                    className="flex-row items-center bg-dark-300 px-4 py-2 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-light-100 text-sm">{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : isSearching ? (
            // Loading State
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#01B4E4" />
              <Text className="text-light-300 mt-4">Searching...</Text>
            </View>
          ) : results.length > 0 ? (
            // Search Results
            <FlatList
              data={results}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  className="flex-row bg-dark-300 mx-4 mb-3 rounded-xl overflow-hidden"
                  onPress={() => handleMoviePress(item.id)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: getImageUrl(item.poster_path, 'poster', 'small') || undefined }}
                    className="w-24 h-36 bg-dark-400"
                    resizeMode="cover"
                  />
                  <View className="flex-1 p-3 justify-center">
                    <Text className="text-light-100 text-base font-semibold" numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.release_date && (
                      <Text className="text-light-300 text-sm mt-1">
                        {new Date(item.release_date).getFullYear()}
                      </Text>
                    )}
                    <View className="flex-row items-center mt-2">
                      <Image 
                        source={icons.star}
                        className="w-4 h-4 mr-1"
                        tintColor="#FFD700"
                      />
                      <Text className="text-light-100 text-sm">
                        {item.vote_average?.toFixed(1) || 'N/A'}
                      </Text>
                    </View>
                    {item.overview && (
                      <Text className="text-light-300 text-xs mt-2" numberOfLines={2}>
                        {item.overview}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              ListHeaderComponent={
                <View className="px-4 mb-4 flex-row items-center justify-between">
                  <Text className="text-light-300 text-sm">
                    Found {totalResults} results for &ldquo;{searchQuery}&rdquo;
                  </Text>
                  <TouchableOpacity onPress={clearSearch}>
                    <Text className="text-primary text-sm">Clear</Text>
                  </TouchableOpacity>
                </View>
              }
              onEndReached={loadMoreResults}
              onEndReachedThreshold={0.5}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          ) : (
            // No Results
            <View className="flex-1 items-center justify-center px-4">
              <View className="w-20 h-20 bg-dark-300 rounded-full items-center justify-center mb-4">
                <Image 
                  source={icons.search}
                  className="w-10 h-10"
                  tintColor="#4B5563"
                />
              </View>
              <Text className="text-light-100 text-lg font-semibold">No Results Found</Text>
              <Text className="text-light-300 text-center mt-2">
                We couldn&apos;t find any matches for &ldquo;{searchQuery}&rdquo;. Try a different search term.
              </Text>
              <TouchableOpacity 
                className="bg-primary px-6 py-3 rounded-full mt-4"
                onPress={clearSearch}
              >
                <Text className="text-dark-100 font-semibold">Clear Search</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Search;