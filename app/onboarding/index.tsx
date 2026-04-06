import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveUserProfile } from '../../utils/storage';

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#1a1a2e',
  text: '#ffffff',
  accent: '#e74c3c', // Red accent for SOS
  gray: '#4a4e69',
  lightGray: '#9a8c98',
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const validatePhone = (phone: string) => {
  const cleanPhone = phone.replace(/\s/g, '');
  const regex = /^\+?[1-9]\d{7,14}$/;
  return regex.test(cleanPhone);
};

interface Slide {
  id: string;
  type: 'welcome' | 'features' | 'setup';
}

const SLIDES: Slide[] = [
  { id: '1', type: 'welcome' },
  { id: '2', type: 'features' },
  { id: '3', type: 'setup' },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const flatListRef = useRef<FlatList<any>>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = async () => {
    if (!name.trim() || !bloodGroup.trim() || !emergencyContact.trim()) {
      Alert.alert('Missing Details', 'Please fill out all fields before continuing.');
      return;
    }

    if (!validatePhone(emergencyContact)) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid number with country code e.g. +919876543210'
      );
      return;
    }

    const success = await saveUserProfile({ name, bloodGroup, emergencyContact });
    if (success) {
      router.replace('/(tabs)/dashboard');
    } else {
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    if (item.type === 'welcome') {
      return (
        <View style={styles.slide}>
          <Text style={styles.emojiIcon}>🛡️</Text>
          <Text style={styles.title}>Welcome to SafeTrip AI</Text>
          <Text style={styles.subtitle}>
            Your personal safety companion wherever you travel. Stay alert and stay safe.
          </Text>
        </View>
      );
    }

    if (item.type === 'features') {
      return (
        <View style={styles.slide}>
          <Text style={styles.emojiIcon}>🗺️</Text>
          <Text style={styles.title}>Travel Securely</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🤖</Text>
            <View>
              <Text style={styles.featureTitle}>AI Advisor</Text>
              <Text style={styles.featureDesc}>Get real-time local safety insights.</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🆘</Text>
            <View>
              <Text style={styles.featureTitle}>Instant SOS</Text>
              <Text style={styles.featureDesc}>Quickly alert emergency contacts.</Text>
            </View>
          </View>
        </View>
      );
    }

    if (item.type === 'setup') {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.slide}
        >
          <ScrollView contentContainerStyle={styles.setupContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Let's Get Started</Text>
            <Text style={styles.subtitle}>Enter your details for emergency situations.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={COLORS.lightGray}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Blood Group</Text>
              <View style={styles.pickerContainer}>
                {BLOOD_GROUPS.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.pickerItem,
                      bloodGroup === group && styles.pickerItemActive
                    ]}
                    onPress={() => setBloodGroup(group)}
                  >
                    <Text style={[
                      styles.pickerText,
                      bloodGroup === group && styles.pickerTextActive
                    ]}>{group}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Emergency Contact (Phone)</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 234 567 890"
                placeholderTextColor={COLORS.lightGray}
                keyboardType="phone-pad"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
              />
              {emergencyContact.length > 0 && !validatePhone(emergencyContact) && (
                <Text style={styles.errorText}>Valid format: +91XXXXXXXXXX</Text>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }

    return null;
  };

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex < SLIDES.length - 1 ? (
            <TouchableOpacity style={styles.btn} onPress={handleNext}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btn, styles.finishBtn]}
              onPress={handleFinish}
            >
              <Text style={styles.btnText}>Finish Setup</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    width,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiIcon: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 15,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 20,
  },
  featureTitle: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureDesc: {
    fontSize: 14,
    color: COLORS.lightGray,
  },
  setupContainer: {
    width: width - 60,
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pickerItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerItemActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  pickerText: {
    color: COLORS.lightGray,
    fontWeight: '600',
  },
  pickerTextActive: {
    color: COLORS.text,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.accent,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  btn: {
    backgroundColor: COLORS.gray,
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  finishBtn: {
    backgroundColor: COLORS.accent,
  },
  btnText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e63946',
    fontSize: 12,
    marginTop: 4,
  },
});
