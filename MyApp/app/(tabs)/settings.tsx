import { useState } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity, Modal, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
];

const LanguagePicker = ({ selectedValue, onValueChange }: { selectedValue: string; onValueChange: (value: string) => void; }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#FFF' : '#000';
  const selectedLanguage = LANGUAGES.find(lang => lang.code === selectedValue)?.name;

  const handleSelect = (code: string) => {
    onValueChange(code);
    setModalVisible(false);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <ThemedView style={styles.modalContent}>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.languageOption} onPress={() => handleSelect(item.code)}>
                  <ThemedText style={styles.languageText}>{item.name}</ThemedText>
                </TouchableOpacity>
              )}
            />
          </ThemedView>
        </Pressable>
      </Modal>
      <TouchableOpacity style={styles.pickerContainer} onPress={() => setModalVisible(true)}>
        <ThemedText>{selectedLanguage}</ThemedText> 
        <Ionicons name="chevron-down" size={20} color={textColor} />
      </TouchableOpacity>
    </>
  );
};

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [language, setLanguage] = useState('en');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const arrowColor = colorScheme === 'dark' ? '#FFF' : '#000';

  const toggleSwitch = () => setIsNotificationsEnabled(previousState => !previousState);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Settings</ThemedText>

      {/* Language Selection */}
      <View style={styles.settingRow}>
        <ThemedText style={styles.label}>Language</ThemedText>
        <LanguagePicker selectedValue={language} onValueChange={setLanguage} />
      </View>

      {/* Notification Toggle */}
      <View style={styles.settingRow}>
        <ThemedText style={styles.label}>Receive Notifications</ThemedText>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isNotificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isNotificationsEnabled}
        />
      </View>

      {/* Bookmarks Link */}
      <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/bookmarks')}>
        <ThemedText style={styles.label}>Bookmarks</ThemedText>
        <Ionicons name="chevron-forward" size={24} color={arrowColor} />
      </TouchableOpacity>

      {/* Favorites Link */}
      <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/favorites')}>
        <ThemedText style={styles.label}>Favorites</ThemedText>
        <Ionicons name="chevron-forward" size={24} color={arrowColor} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  label: {
    fontSize: 18,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  languageOption: {
    paddingVertical: 15,
  },
  languageText: {
    fontSize: 18,
  },
});
