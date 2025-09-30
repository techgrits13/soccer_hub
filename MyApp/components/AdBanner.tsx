import React from 'react';
import { BannerAd, BannerAdSize } from 'expo-ads-admob';
import { View, StyleSheet } from 'react-native';

const ADMOB_BANNER_ID = 'ca-app-pub-2559460320140731/7038445089';

export const AdBanner = () => (
  <View style={styles.container}>
    <BannerAd
      size={BannerAdSize.BANNER}
      unitId={ADMOB_BANNER_ID}
      onDidFailToReceiveAdWithError={(error: any) => console.log('Ad failed to load:', error)}
      onAdViewDidReceiveAd={() => console.log('Ad loaded')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
});
