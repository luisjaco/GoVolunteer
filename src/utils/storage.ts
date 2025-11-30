// essentially local storage.

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
    async get(key: string): Promise<string | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch {
            return null;
        }
    },
    
    async set(key: string, value: string) {
        return AsyncStorage.setItem(key, value);
    },

    async removeItem(key: string) {
        return AsyncStorage.removeItem(key);
    }
}