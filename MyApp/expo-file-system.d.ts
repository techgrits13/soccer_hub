declare module 'expo-file-system' {
  export const documentDirectory: string | null;
  export function getInfoAsync(fileUri: string, options?: { md5?: boolean; size?: boolean; }): Promise<{ exists: boolean; isDirectory: boolean; modificationTime: number; size?: number; uri: string; md5?: string; }>;
  export function readAsStringAsync(fileUri: string, options?: { encoding?: 'utf8' | 'base64'; }): Promise<string>;
  export function writeAsStringAsync(fileUri: string, contents: string, options?: { encoding?: 'utf8' | 'base64'; }): Promise<void>;
}
