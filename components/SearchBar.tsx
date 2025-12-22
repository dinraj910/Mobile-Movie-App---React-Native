import { icons } from '@/constants/icons';
import React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = "Search for a movie, tv show...",
  onSubmit 
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-dark-300 rounded-full px-4 py-3 mx-4">
      <Image 
        source={icons.search} 
        className="w-5 h-5 mr-3"
        tintColor="#90CEA1"
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="flex-1 text-light-100 text-base"
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <View className="w-5 h-5 rounded-full bg-dark-400 items-center justify-center">
            <View className="w-2 h-0.5 bg-light-300 rotate-45 absolute" />
            <View className="w-2 h-0.5 bg-light-300 -rotate-45 absolute" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
