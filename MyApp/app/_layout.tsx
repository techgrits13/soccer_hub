import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { BookmarksProvider } from '@/contexts/bookmarks-provider';
import { showAppOpenAdIfNeeded } from '@/utils/adManager';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    showAppOpenAdIfNeeded();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BookmarksProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="bookmarks" options={{ title: 'Bookmarks' }} />
          <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </BookmarksProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
