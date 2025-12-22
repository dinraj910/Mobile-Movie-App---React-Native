import { MovieCard, SearchBar, SectionHeader, TrendingCard } from '@/components';
import { icons } from '@/constants/icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { movieApi } from '@/services';

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Movie data state
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      const [trending, popular, nowPlaying, topRated, upcoming] = await Promise.all([
        movieApi.getTrending('week'),
        movieApi.getPopular(),
        movieApi.getNowPlaying(),
        movieApi.getTopRated(),
        movieApi.getUpcoming(),
      ]);
      
      setTrendingMovies(trending.results?.slice(0, 10) || []);
      setPopularMovies(popular.results?.slice(0, 10) || []);
      setNowPlayingMovies(nowPlaying.results?.slice(0, 10) || []);
      setTopRatedMovies(topRated.results?.slice(0, 10) || []);
      setUpcomingMovies(upcoming.results?.slice(0, 10) || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllMovies();
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/search',
        params: { query: searchQuery }
      });
    }
  };

  const handleGenreSelect = async (genreId: number) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
      await fetchAllMovies();
    } else {
      setSelectedGenre(genreId);
      try {
        const genreMovies = await movieApi.discoverByGenre(genreId);
        setPopularMovies(genreMovies.results?.slice(0, 10) || []);
      } catch (error) {
        console.error('Error fetching genre movies:', error);
      }
    }
  };

  return (
    <View className="flex-1 bg-dark-200">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#01B4E4"
              colors={['#01B4E4']}
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-row items-center">
              <Image 
                source={icons.logo} 
                className="w-10 h-10"
                resizeMode="contain"
              />
              <View className="ml-3">
                <Text className="text-light-100 text-2xl font-bold">TMDB</Text>
                <Text className="text-light-300 text-xs">The Movie Database</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-dark-300 p-2 rounded-full">
              <Image 
                source={icons.person} 
                className="w-6 h-6"
                tintColor="#90CEA1"
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="mt-2">
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmit={handleSearch}
            />
          </View>

          {/* Trending Section */}
          <View className="mt-6">
            <SectionHeader title="🔥 Trending Now" showSeeAll={false} />
            <FlatList
              data={trendingMovies}
              renderItem={({ item, index }) => (
                <TrendingCard movie={item} index={index} />
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>

          {/* Genre Chips */}
          <View className="mt-6">
            <SectionHeader title="Categories" showSeeAll={false} />
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {genres.map((genre) => (
                <TouchableOpacity
                  key={genre.id}
                  onPress={() => handleGenreSelect(genre.id)}
                  className={`px-4 py-2 rounded-full mr-2 ${
                    selectedGenre === genre.id 
                      ? 'bg-primary' 
                      : 'bg-dark-300 border border-dark-400'
                  }`}
                >
                  <Text 
                    className={`text-sm font-medium ${
                      selectedGenre === genre.id ? 'text-dark-100' : 'text-light-100'
                    }`}
                  >
                    {genre.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Popular Movies */}
          <View className="mt-6">
            <SectionHeader 
              title={selectedGenre ? "Movies by Genre" : "Popular Movies"}
              onSeeAll={() => console.log('See all popular')} 
            />
            {loading ? (
              <View className="h-48 items-center justify-center">
                <ActivityIndicator size="large" color="#01B4E4" />
              </View>
            ) : (
              <FlatList
                data={popularMovies}
                renderItem={({ item }) => <MovieCard movie={item} size="medium" />}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                ListEmptyComponent={
                  <Text className="text-light-300 px-4">No movies found</Text>
                }
              />
            )}
          </View>

          {/* Now Playing */}
          <View className="mt-6">
            <SectionHeader 
              title="Now Playing" 
              onSeeAll={() => console.log('See all now playing')} 
            />
            <FlatList
              data={nowPlayingMovies}
              renderItem={({ item }) => <MovieCard movie={item} size="medium" />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>

          {/* Top Rated */}
          <View className="mt-6">
            <SectionHeader 
              title="⭐ Top Rated" 
              onSeeAll={() => console.log('See all top rated')} 
            />
            <FlatList
              data={topRatedMovies}
              renderItem={({ item }) => <MovieCard movie={item} size="medium" />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>

          {/* Upcoming */}
          <View className="mt-6">
            <SectionHeader 
              title="🎬 Coming Soon" 
              onSeeAll={() => console.log('See all upcoming')} 
            />
            <FlatList
              data={upcomingMovies}
              renderItem={({ item }) => <MovieCard movie={item} size="medium" />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>

          {/* Featured Section */}
          <View className="mt-6 mx-4 bg-dark-100 rounded-2xl p-4 overflow-hidden">
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-secondary text-xs font-semibold uppercase tracking-wider">
                  Featured
                </Text>
                <Text className="text-light-100 text-xl font-bold mt-1">
                  Discover New Movies
                </Text>
                <Text className="text-light-300 text-sm mt-2">
                  Explore thousands of movies and TV shows from TMDB
                </Text>
                <TouchableOpacity 
                  className="bg-primary px-4 py-2 rounded-full mt-4 self-start"
                  onPress={() => router.push('/search')}
                >
                  <Text className="text-dark-100 font-semibold">Explore Now</Text>
                </TouchableOpacity>
              </View>
              <View className="w-24 h-24 bg-dark-400 rounded-full items-center justify-center">
                <Image 
                  source={icons.search}
                  className="w-10 h-10"
                  tintColor="#01B4E4"
                />
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
