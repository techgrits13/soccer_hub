import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';

const TabBarIcon = ({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) => (
  <Ionicons size={28} style={{ marginBottom: -3 }} name={name} color={color} />
);

export default function TabLayout() {
  const { toggleTheme, colorScheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        headerShown: true,
        headerTitle: 'Soccer Hub',
        headerRight: () => (
          <View style={{ marginRight: 15 }}>
            <Ionicons 
              name={colorScheme === 'dark' ? 'sunny' : 'moon'} 
              size={24} 
              color={colorScheme === 'dark' ? '#fff' : '#000'}
              onPress={toggleTheme}
            />
          </View>
        )
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="livescores"
        options={{
          title: 'Live Scores',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'football' : 'football-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="predictions"
        options={{
          title: 'Predictions',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bulb' : 'bulb-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
