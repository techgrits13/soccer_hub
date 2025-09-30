import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'https://your-backend-url.com';

export const buildApiUrl = (path: string) => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
