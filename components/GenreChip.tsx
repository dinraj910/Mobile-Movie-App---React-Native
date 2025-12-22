import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface GenreChipProps {
  genre: {
    id: number;
    name: string;
  };
  isSelected?: boolean;
  onPress?: () => void;
}

const GenreChip = ({ genre, isSelected = false, onPress }: GenreChipProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
        isSelected 
          ? 'bg-primary' 
          : 'bg-dark-300 border border-dark-400'
      }`}
    >
      <Text 
        className={`text-sm font-medium ${
          isSelected ? 'text-dark-100' : 'text-light-100'
        }`}
      >
        {genre.name}
      </Text>
    </TouchableOpacity>
  );
};

export default GenreChip;
