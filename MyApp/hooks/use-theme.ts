import { useColorScheme } from 'react-native';

export function useTheme() {
  const colorScheme = useColorScheme();
  
  return {
    colorScheme,
    toggleTheme: () => {
      // This will be handled by the system preferences
      console.log('Theme toggle pressed');
    }
  };
}
