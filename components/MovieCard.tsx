import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date?: string;
  };
  size?: 'small' | 'medium' | 'large';
}

const MovieCard = ({ movie, size = 'medium' }: MovieCardProps) => {
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  
  const sizeStyles = {
    small: { width: 100, height: 150 },
    medium: { width: 140, height: 210 },
    large: { width: 180, height: 270 },
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 7) return 'bg-rating-high';
    if (rating >= 5) return 'bg-rating-medium';
    return 'bg-rating-low';
  };

  const getRatingBorderColor = (rating: number) => {
    if (rating >= 7) return 'border-rating-high';
    if (rating >= 5) return 'border-rating-medium';
    return 'border-rating-low';
  };

  return (
    <Link href={`/movies/${movie.id}`} asChild>
      <TouchableOpacity className="mr-4">
        <View 
          className="rounded-lg overflow-hidden bg-dark-300"
          style={sizeStyles[size]}
        >
          <Image
            source={{ uri: `${imageBaseUrl}${movie.poster_path}` }}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Rating Badge */}
          <View className={`absolute -bottom-3 left-2 w-9 h-9 rounded-full ${getRatingColor(movie.vote_average)} border-2 border-dark-200 items-center justify-center`}>
            <Text className="text-white text-xs font-bold">
              {movie.vote_average?.toFixed(1)}
            </Text>
          </View>
        </View>
        
        <View className="mt-4 pr-2" style={{ width: sizeStyles[size].width }}>
          <Text 
            className="text-light-100 text-sm font-semibold" 
            numberOfLines={2}
          >
            {movie.title}
          </Text>
          {movie.release_date && (
            <Text className="text-light-300 text-xs mt-1">
              {new Date(movie.release_date).getFullYear()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
