import { icons } from '@/constants/icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wishlistStorage, watchedStorage, reviewStorage, getImageUrl } from '@/services';

type TabType = 'wishlist' | 'watched' | 'reviews';

interface SavedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  addedAt?: string;
}

interface UserReview {
  movieId: number;
  title: string;
  poster_path: string;
  rating: number;
  text: string;
  createdAt: string;
}

const Saved = () => {
  const [activeTab, setActiveTab] = useState<TabType>('wishlist');
  const [wishlist, setWishlist] = useState<SavedMovie[]>([]);
  const [watched, setWatched] = useState<SavedMovie[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [wishlistData, watchedData, reviewsData] = await Promise.all([
        wishlistStorage.getWishlist(),
        watchedStorage.getWatched(),
        reviewStorage.getAllReviews(),
      ]);
      setWishlist(wishlistData);
      setWatched(watchedData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (id: number) => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this movie from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await wishlistStorage.removeFromWishlist(id);
            setWishlist(wishlist.filter(m => m.id !== id));
          },
        },
      ]
    );
  };

  const handleRemoveFromWatched = async (id: number) => {
    Alert.alert(
      'Remove from Watched',
      'Are you sure you want to remove this movie from your watched list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await watchedStorage.removeFromWatched(id);
            setWatched(watched.filter(m => m.id !== id));
          },
        },
      ]
    );
  };

  const handleDeleteReview = async (movieId: number) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await reviewStorage.deleteReview(movieId);
            setReviews(reviews.filter(r => r.movieId !== movieId));
          },
        },
      ]
    );
  };

  const TabButton = ({ type, label, count }: { type: TabType; label: string; count: number }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(type)}
      className={`flex-1 py-3 rounded-xl mr-2 ${
        activeTab === type ? 'bg-primary' : 'bg-dark-300'
      }`}
    >
      <Text className={`text-center text-sm font-semibold ${
        activeTab === type ? 'text-dark-100' : 'text-light-100'
      }`}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderWishlistItem = ({ item }: { item: SavedMovie }) => (
    <TouchableOpacity 
      className="flex-row bg-dark-300 mx-4 mb-3 rounded-xl overflow-hidden"
      onPress={() => router.push(`/movies/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getImageUrl(item.poster_path, 'poster', 'small') || undefined }}
        className="w-24 h-36 bg-dark-400"
        resizeMode="cover"
      />
      <View className="flex-1 p-3 justify-between">
        <View>
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
        </View>
        
        <View className="flex-row justify-end items-center">
          <TouchableOpacity 
            onPress={() => handleRemoveFromWishlist(item.id)}
            className="bg-red-500/20 px-3 py-1.5 rounded-full"
          >
            <Text className="text-red-400 text-xs">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderWatchedItem = ({ item }: { item: SavedMovie }) => (
    <TouchableOpacity 
      className="flex-row bg-dark-300 mx-4 mb-3 rounded-xl overflow-hidden"
      onPress={() => router.push(`/movies/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getImageUrl(item.poster_path, 'poster', 'small') || undefined }}
        className="w-24 h-36 bg-dark-400"
        resizeMode="cover"
      />
      <View className="flex-1 p-3 justify-between">
        <View>
          <View className="flex-row items-center">
            <Text className="text-light-100 text-base font-semibold flex-1" numberOfLines={2}>
              {item.title}
            </Text>
            <View className="bg-accent px-2 py-0.5 rounded-full ml-2">
              <Text className="text-dark-100 text-xs font-medium">✓ Watched</Text>
            </View>
          </View>
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
        </View>
        
        <View className="flex-row justify-end items-center">
          <TouchableOpacity 
            onPress={() => handleRemoveFromWatched(item.id)}
            className="bg-red-500/20 px-3 py-1.5 rounded-full"
          >
            <Text className="text-red-400 text-xs">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }: { item: UserReview }) => (
    <TouchableOpacity 
      className="bg-dark-300 mx-4 mb-3 rounded-xl overflow-hidden p-4"
      onPress={() => router.push(`/movies/${item.movieId}`)}
      activeOpacity={0.8}
    >
      <View className="flex-row">
        <Image
          source={{ uri: getImageUrl(item.poster_path, 'poster', 'small') || undefined }}
          className="w-16 h-24 rounded-lg bg-dark-400"
          resizeMode="cover"
        />
        <View className="flex-1 ml-3">
          <Text className="text-light-100 text-base font-semibold" numberOfLines={1}>
            {item.title}
          </Text>
          
          {/* Rating Stars */}
          <View className="flex-row items-center mt-2">
            {[...Array(10)].map((_, i) => (
              <Image
                key={i}
                source={icons.star}
                className="w-3 h-3 mr-0.5"
                tintColor={i < item.rating ? '#FFD700' : '#4B5563'}
              />
            ))}
            <Text className="text-light-100 text-sm ml-2">{item.rating}/10</Text>
          </View>
          
          {item.text ? (
            <Text className="text-light-300 text-sm mt-2" numberOfLines={2}>
              {item.text}
            </Text>
          ) : (
            <Text className="text-light-300 text-sm mt-2 italic">No written review</Text>
          )}
        </View>
      </View>
      
      <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-dark-400">
        <Text className="text-light-300 text-xs">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity 
          onPress={() => handleDeleteReview(item.movieId)}
          className="bg-red-500/20 px-3 py-1.5 rounded-full"
        >
          <Text className="text-red-400 text-xs">Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = ({ type }: { type: TabType }) => {
    const config = {
      wishlist: {
        icon: icons.save,
        title: 'Your Wishlist is Empty',
        description: 'Movies you want to watch will appear here. Start exploring and add some!',
      },
      watched: {
        icon: icons.star,
        title: 'No Watched Movies',
        description: 'Mark movies as watched to keep track of what you\'ve seen.',
      },
      reviews: {
        icon: icons.star,
        title: 'No Reviews Yet',
        description: 'Rate and review movies you\'ve watched to remember your thoughts.',
      },
    };

    const { icon, title, description } = config[type];

    return (
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-24 h-24 bg-dark-300 rounded-full items-center justify-center mb-6">
          <Image 
            source={icon}
            className="w-12 h-12"
            tintColor="#4B5563"
          />
        </View>
        <Text className="text-light-100 text-xl font-bold text-center">
          {title}
        </Text>
        <Text className="text-light-300 text-center mt-3">
          {description}
        </Text>
        <TouchableOpacity 
          className="bg-primary px-6 py-3 rounded-full mt-6"
          onPress={() => router.push('/(tabs)')}
        >
          <Text className="text-dark-100 font-semibold">Discover Movies</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getCurrentList = () => {
    switch (activeTab) {
      case 'wishlist':
        return wishlist;
      case 'watched':
        return watched;
      case 'reviews':
        return reviews;
    }
  };

  const getRenderItem = () => {
    switch (activeTab) {
      case 'wishlist':
        return renderWishlistItem;
      case 'watched':
        return renderWatchedItem;
      case 'reviews':
        return renderReviewItem;
    }
  };

  return (
    <View className="flex-1 bg-dark-200">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-4">
          <Text className="text-light-100 text-2xl font-bold">My Library</Text>
          <Text className="text-light-300 text-sm mt-1">
            Track your movies and reviews
          </Text>
        </View>

        {/* Tab Buttons */}
        <View className="flex-row px-4 mb-4">
          <TabButton type="wishlist" label="Wishlist" count={wishlist.length} />
          <TabButton type="watched" label="Watched" count={watched.length} />
          <TabButton type="reviews" label="Reviews" count={reviews.length} />
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#01B4E4" />
          </View>
        ) : getCurrentList().length > 0 ? (
          <FlatList
            data={getCurrentList() as any[]}
            renderItem={getRenderItem() as any}
            keyExtractor={(item: any) => (item.id || item.movieId).toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        ) : (
          <EmptyState type={activeTab} />
        )}
      </SafeAreaView>
    </View>
  );
};

export default Saved;