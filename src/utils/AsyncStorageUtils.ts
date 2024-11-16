// src/utils/AsyncStorageUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getData = async (key: string): Promise<any> => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const removeData = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
