import { View, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function LiveScoresScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title">Live Scores</ThemedText>
    </View>
  );
}
