import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as FileSystem from 'expo-file-system';

const bookmarksDir = FileSystem.documentDirectory;
const BOOKMARKS_FILE = bookmarksDir ? `${bookmarksDir}bookmarks.json` : null;

// Define the shape of a news item
interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
  isoDate: string;
  creator?: string;
  snippet?: string;
  source: string;
}

// Define the shape of the context
interface BookmarksContextType {
  bookmarks: NewsItem[];
  loading: boolean;
  addBookmark: (item: NewsItem) => void;
  removeBookmark: (link: string) => void;
  isBookmarked: (link: string) => boolean;
}

// Create the context
const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

// Create the provider component
export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to load bookmarks from the file system
  const loadBookmarks = useCallback(async () => {
    if (!BOOKMARKS_FILE) {
      setLoading(false);
      return;
    }
    try {
      const fileInfo = await FileSystem.getInfoAsync(BOOKMARKS_FILE);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(BOOKMARKS_FILE);
        setBookmarks(JSON.parse(content));
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load bookmarks when the provider mounts
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Function to save bookmarks to the file system
  const saveBookmarks = async (newBookmarks: NewsItem[]) => {
    if (!BOOKMARKS_FILE) return;
    try {
      await FileSystem.writeAsStringAsync(BOOKMARKS_FILE, JSON.stringify(newBookmarks, null, 2));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  // Function to add a bookmark
  const addBookmark = useCallback((item: NewsItem) => {
    const newBookmarks = [...bookmarks, item];
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  }, [bookmarks]);

  // Function to remove a bookmark
  const removeBookmark = useCallback((link: string) => {
    const newBookmarks = bookmarks.filter(item => item.link !== link);
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  }, [bookmarks]);

  // Function to check if an item is bookmarked
  const isBookmarked = useCallback((link: string) => {
    return bookmarks.some(item => item.link === link);
  }, [bookmarks]);

  // Provide the context value to children
  return (
    <BookmarksContext.Provider value={{ bookmarks, loading, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  );
}

// Custom hook to use the bookmarks context
export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
