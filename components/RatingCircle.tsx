import React from 'react';
import { Text, View } from 'react-native';

interface RatingCircleProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
}

const RatingCircle = ({ rating, size = 'medium' }: RatingCircleProps) => {
  const sizeStyles = {
    small: { container: 'w-10 h-10', text: 'text-xs' },
    medium: { container: 'w-14 h-14', text: 'text-sm' },
    large: { container: 'w-20 h-20', text: 'text-xl' },
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 7) return 'border-rating-high';
    if (rating >= 5) return 'border-rating-medium';
    return 'border-rating-low';
  };

  const percentage = Math.round(rating * 10);

  return (
    <View 
      className={`${sizeStyles[size].container} rounded-full bg-dark-200 border-4 ${getRatingColor(rating)} items-center justify-center`}
    >
      <Text className={`text-white font-bold ${sizeStyles[size].text}`}>
        {percentage}
        <Text className="text-xs">%</Text>
      </Text>
    </View>
  );
};

export default RatingCircle;
