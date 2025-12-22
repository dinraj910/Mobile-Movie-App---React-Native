import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

const SectionHeader = ({ title, onSeeAll, showSeeAll = true }: SectionHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between px-4 mb-4">
      <Text className="text-light-100 text-xl font-bold">{title}</Text>
      {showSeeAll && onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text className="text-primary text-sm font-medium">See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
