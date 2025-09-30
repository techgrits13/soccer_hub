import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NewsCard } from '@/components/news-card';
import { useBookmarks } from '@/contexts/bookmarks-provider';

// Define the type for a news item
interface NewsItem {
  title: string;
  link: string;
  isoDate: string;
  source: string;
  imageUrl?: string;
  creator?: string;
  snippet?: string;
}

export default function HomeScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://10.68.32.161:8000/api/feeds');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: NewsItem[] = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        Alert.alert("Error", "Failed to load news. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleCardPress = async (item: NewsItem) => {
    const supported = await Linking.canOpenURL(item.link);
    if (supported) {
      await Linking.openURL(item.link);
    } else {
      Alert.alert(`Don't know how to open this URL: ${item.link}`);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Latest Soccer News</ThemedText>
      <FlatList
        data={news}
        keyExtractor={(item, index) => `${item.link}-${index}`}
        initialNumToRender={10} // Render 10 items initially
        windowSize={5} // Keep 5 items in memory
        renderItem={({ item }) => {
          const bookmarked = isBookmarked(item.link);
          return (
            <NewsCard 
              item={item} 
              onPress={() => handleCardPress(item)} 
              isBookmarked={bookmarked}
              onToggleBookmark={() => {
                if (bookmarked) {
                  removeBookmark(item.link);
                } else {
                  addBookmark(item);
                }
              }}
            />
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
});
