import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@safetrip_user';

export interface UserProfile {
  name: string;
  bloodGroup: string;
  emergencyContact: string;
}

export const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(profile);
    await AsyncStorage.setItem(USER_PROFILE_KEY, jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving user profile', e);
    return false;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error reading user profile', e);
    return null;
  }
};
