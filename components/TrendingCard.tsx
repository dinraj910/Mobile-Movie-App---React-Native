import { Link } from 'expo-router';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

interface TrendingCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    vote_average: number;
  };
  index: number;
}

const TrendingCard = ({ movie, index }: TrendingCardProps) => {
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w780';

  return (
    <Link href={`/movies/${movie.id}`} asChild>
      <TouchableOpacity className="mr-4">
        <View className="w-72 h-40 rounded-2xl overflow-hidden">
          <ImageBackground
            source={{ uri: `${imageBaseUrl}${movie.backdrop_path || movie.poster_path}` }}
            className="w-full h-full justify-end"
            resizeMode="cover"
          >
            {/* Gradient Overlay */}
            <View className="absolute inset-0 bg-black/40" />
            
            {/* Ranking Number */}
            <View className="absolute top-2 left-3">
              <Text className="text-6xl font-bold text-primary opacity-80">
                #{index + 1}
              </Text>
            </View>
            
            {/* Movie Info */}
            <View className="p-4">
              <Text className="text-white text-lg font-bold" numberOfLines={1}>
                {movie.title}
              </Text>
              <View className="flex-row items-center mt-1">
                <View className="bg-accent px-2 py-0.5 rounded">
                  <Text className="text-dark-100 text-xs font-bold">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;
