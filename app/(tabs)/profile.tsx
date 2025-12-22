import { icons } from '@/constants/icons';
import React from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  iconColor?: string;
}

const MenuItem = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true,
  iconColor = '#90CEA1'
}: MenuItemProps) => (
  <TouchableOpacity 
    className="flex-row items-center bg-dark-300 p-4 rounded-xl mb-3"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="w-10 h-10 bg-dark-400 rounded-full items-center justify-center">
      <Image source={icon} className="w-5 h-5" tintColor={iconColor} />
    </View>
    <View className="flex-1 ml-3">
      <Text className="text-light-100 text-base font-medium">{title}</Text>
      {subtitle && (
        <Text className="text-light-300 text-sm mt-0.5">{subtitle}</Text>
      )}
    </View>
    {showArrow && (
      <Image 
        source={icons.arrow}
        className="w-5 h-5"
        tintColor="#6B7280"
        style={{ transform: [{ rotate: '180deg' }] }}
      />
    )}
  </TouchableOpacity>
);

const Profile = () => {
  return (
    <View className="flex-1 bg-dark-200">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-4 py-4">
            <Text className="text-light-100 text-2xl font-bold">Profile</Text>
          </View>

          {/* Profile Card */}
          <View className="mx-4 bg-dark-100 rounded-2xl p-6 mb-6">
            <View className="flex-row items-center">
              <View className="w-20 h-20 bg-primary rounded-full items-center justify-center">
                <Text className="text-dark-100 text-3xl font-bold">JD</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-light-100 text-xl font-bold">John Doe</Text>
                <Text className="text-light-300 text-sm mt-1">john.doe@email.com</Text>
                <View className="flex-row mt-2">
                  <View className="bg-secondary/20 px-3 py-1 rounded-full">
                    <Text className="text-secondary text-xs font-medium">Premium</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="bg-dark-300 p-2 rounded-full">
                <Image 
                  source={icons.arrow}
                  className="w-5 h-5"
                  tintColor="#01B4E4"
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View className="flex-row mt-6 pt-6 border-t border-dark-400">
              <View className="flex-1 items-center">
                <Text className="text-primary text-2xl font-bold">42</Text>
                <Text className="text-light-300 text-sm">Watchlist</Text>
              </View>
              <View className="w-px bg-dark-400" />
              <View className="flex-1 items-center">
                <Text className="text-secondary text-2xl font-bold">128</Text>
                <Text className="text-light-300 text-sm">Watched</Text>
              </View>
              <View className="w-px bg-dark-400" />
              <View className="flex-1 items-center">
                <Text className="text-accent text-2xl font-bold">35</Text>
                <Text className="text-light-300 text-sm">Reviews</Text>
              </View>
            </View>
          </View>

          {/* Account Section */}
          <View className="px-4">
            <Text className="text-light-300 text-sm font-medium uppercase tracking-wider mb-3">
              Account
            </Text>
            <MenuItem 
              icon={icons.person}
              title="Edit Profile"
              subtitle="Update your personal information"
            />
            <MenuItem 
              icon={icons.save}
              title="Notifications"
              subtitle="Manage your notification preferences"
            />
            <MenuItem 
              icon={icons.star}
              title="Subscription"
              subtitle="Premium member"
              iconColor="#FFD700"
            />
          </View>

          {/* Preferences Section */}
          <View className="px-4 mt-6">
            <Text className="text-light-300 text-sm font-medium uppercase tracking-wider mb-3">
              Preferences
            </Text>
            <MenuItem 
              icon={icons.play}
              title="Playback Settings"
              subtitle="Quality, subtitles, audio"
            />
            <MenuItem 
              icon={icons.search}
              title="Content Preferences"
              subtitle="Genres, recommendations"
            />
          </View>

          {/* Support Section */}
          <View className="px-4 mt-6">
            <Text className="text-light-300 text-sm font-medium uppercase tracking-wider mb-3">
              Support
            </Text>
            <MenuItem 
              icon={icons.logo}
              title="Help Center"
              subtitle="FAQs and support articles"
            />
            <MenuItem 
              icon={icons.arrow}
              title="Privacy Policy"
              iconColor="#6B7280"
            />
            <MenuItem 
              icon={icons.arrow}
              title="Terms of Service"
              iconColor="#6B7280"
            />
          </View>

          {/* Sign Out */}
          <View className="px-4 mt-6">
            <TouchableOpacity 
              className="bg-rating-low/20 p-4 rounded-xl items-center"
              activeOpacity={0.7}
            >
              <Text className="text-rating-low font-semibold">Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <View className="items-center mt-6">
            <Text className="text-light-300 text-xs">TMDB Mobile App v1.0.0</Text>
            <Text className="text-light-300 text-xs mt-1">Powered by The Movie Database</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Profile;