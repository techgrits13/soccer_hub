import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type NewsItem = {
  title: string;
  link: string;
  isoDate: string;
  source: string;
  imageUrl?: string;
  creator?: string;
  snippet?: string;
};

const KenyanFlagAccent = () => (
  <View style={styles.flagContainer}>
    <View style={[styles.flagStripe, { backgroundColor: '#000000' }]} />
    <View style={[styles.flagStripe, { backgroundColor: '#922529' }]} />
    <View style={[styles.flagStripe, { backgroundColor: '#008450' }]} />
  </View>
);

export function NewsCard({
  item,
  onPress,
  isBookmarked,
  onToggleBookmark,
}: {
  item: NewsItem;
  onPress: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const timeAgo = dayjs().to(dayjs(item.isoDate));

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <ThemedView style={styles.cardContent}>
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}
        <View style={styles.textContainer}>
          <View style={styles.headerContainer}>
            <ThemedText type="subtitle" style={styles.title} numberOfLines={2}>{item.title}</ThemedText>
            <TouchableOpacity onPress={onToggleBookmark} style={styles.bookmarkButton}>
              <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={24} color={isBookmarked ? '#FFD700' : '#ccc'} />
            </TouchableOpacity>
          </View>
          <View style={styles.metadataContainer}>
            <ThemedText style={styles.source}>{item.source}</ThemedText>
            <ThemedText style={styles.date}>{timeAgo}</ThemedText>
          </View>
        </View>
        <KenyanFlagAccent />
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  textContainer: {
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 10,
  },
  bookmarkButton: {
    paddingLeft: 10, // Increase tappable area
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
  flagContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    height: 6,
    width: 24,
    borderRadius: 2,
    overflow: 'hidden',
  },
  flagStripe: {
    flex: 1,
  },
});
