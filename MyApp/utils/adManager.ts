import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOpenAd, AdEventType } from 'expo-ads-admob';

const ADMOB_APP_OPEN_ID = 'ca-app-pub-2559460320140731/5617374594';
const STORAGE_KEY = 'appOpenAdLastShown';

export const showAppOpenAdIfNeeded = async () => {
  try {
    const lastShown = await AsyncStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();

    if (lastShown === today) {
      console.log('App open ad already shown today');
      return;
    }

    const ad = AppOpenAd.createForAdRequest(ADMOB_APP_OPEN_ID);

    ad.addEventListener(AdEventType.Loaded, () => {
      ad.show();
      AsyncStorage.setItem(STORAGE_KEY, today);
    });

    ad.addEventListener(AdEventType.Error, (error: any) => {
      console.log('App open ad error:', error);
    });

    ad.load();
  } catch (error) {
    console.error('Error showing app open ad:', error);
  }
};
