import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBookmarks } from '@/contexts/bookmarks-provider';
import { NewsCard } from '@/components/news-card';

export default function BookmarksScreen() {
  const { bookmarks, loading, removeBookmark, isBookmarked } = useBookmarks();

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Bookmarked Articles</ThemedText>
      {bookmarks.length > 0 ? (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.link}
          renderItem={({ item }) => (
            <NewsCard 
              item={item} 
              onPress={() => {}} 
              isBookmarked={isBookmarked(item.link)}
              onToggleBookmark={() => removeBookmark(item.link)}
            />
          )}
        />
      ) : (
        <ThemedText style={styles.emptyText}>You have no bookmarked articles.</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  bookmarkItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
