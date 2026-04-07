import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';
import SafetyLogRecorder from '../../components/SafetyLogRecorder';
import { getSafetyAdvice } from '../../utils/ai';
import { getUserProfile, UserProfile } from '../../utils/storage';

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#1a1a2e',
  surface: '#16213e',
  surfaceVariant: '#222831',
  text: '#ffffff',
  textSecondary: '#9a8c98',
  accent: '#e74c3c', // Red accent for SOS
  primary: '#0f3460',
  secondary: '#3498db',
};

const markdownStyles = {
  body: {
    color: '#ffffff',
    fontSize: Math.round(16 * width / 390),
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  bullet_list: {
    marginBottom: 8,
  },
  strong: {
    color: '#3498db',
    fontWeight: 'bold' as const,
  },
};

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Welcome back! I\'m your **AI Safety Advisor**. Ask me anything about your current location or general travel safety.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recorderVisible, setRecorderVisible] = useState(false);


  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    const newUserMessage: Message = { role: 'user', text: userMessage };

    // Add user message to UI immediately
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    // Call Gemini AI
    const aiResponse = await getSafetyAdvice(userMessage);
    const newAiMessage: Message = { role: 'ai', text: aiResponse };

    // Add AI response to UI
    setMessages(prev => [...prev, newAiMessage]);
    setIsLoading(false);
  };

  const sendEmergencySMS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location access is needed to send your coordinates.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const mapLink = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;

      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync([], `EMERGENCY! I need help. My current location is: ${mapLink}`);
      } else {
        Alert.alert("Error", "SMS services are not available on this device.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to prepare emergency message.");
    }
  };

  const handleSOSPress = () => {
    Alert.alert(
      "EMERGENCY",
      "Are you sure you want to call emergency services?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Text Contact",
          onPress: sendEmergencySMS
        },
        {
          text: "Call 112",
          style: "destructive",
          onPress: () => Linking.openURL('tel:112')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
      >
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>Safe Travels,</Text>
            <Text style={styles.headerTitle}>{profile?.name || 'Traveler'}!</Text>
          </View>


          {/* Quick Pulse Card */}
          <View style={styles.pulseCard}>
            <View style={styles.pulseHeader}>
              <Text style={styles.pulseLabel}>📍 Location: Active Tracking</Text>
              <View style={styles.pulseDot} />
            </View>
            <Text style={styles.pulseStatus}>
              Real-time safety analysis enabled. Stay alert and keep your device charged.
            </Text>
          </View>

          {/* Safety Log Modal Trigger */}
          <TouchableOpacity onPress={() => setRecorderVisible(true)} style={{ backgroundColor: '#1a0a0a', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 12, marginHorizontal: width * 0.05, borderWidth: 1, borderColor: '#4a1a1a', marginBottom: 6 }}>
            <Text style={{ color: '#e63946', fontSize: Math.round(15 * width / 390), fontWeight: '600' }}>🎙 Safety Log</Text>
          </TouchableOpacity>

          <Modal visible={recorderVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setRecorderVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#0a0a0a', padding: width * 0.05 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingTop: 10 }}>
                <Text style={{ fontSize: Math.round(20 * width / 390), fontWeight: 'bold', color: '#fff' }}>Safety Log Recorder</Text>
                <TouchableOpacity onPress={() => setRecorderVisible(false)}>
                  <Text style={{ color: '#666', fontSize: Math.round(14 * width / 390) }}>X Close</Text>
                </TouchableOpacity>
              </View>
              <SafetyLogRecorder />
            </View>
          </Modal>

          <TouchableOpacity 
            onPress={() => router.push('/fake-call')} 
            style={{ 
              backgroundColor: '#0a1a0a', 
              borderRadius: 12, 
              padding: 14, 
              alignItems: 'center', 
              marginTop: 8, 
              marginHorizontal: width * 0.05, 
              borderWidth: 1, 
              borderColor: '#1a4a1a', 
              marginBottom: 6 
            }}
          >
            <Text style={{ color: '#FF8C00', fontSize: Math.round(15 * width / 390), fontWeight: '600' }}>📞 Fake Call</Text>
          </TouchableOpacity>

          {/* Chat Interface Scroll Area */}
          <View style={styles.chatContainer}>
            <Text style={styles.advisorTitle}>AI Safety Advisor</Text>
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatArea}
              contentContainerStyle={styles.chatScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((message, index) => (
                <View
                  key={index.toString()}
                  style={[
                    styles.bubble,
                    message.role === 'ai' ? styles.aiBubble : styles.userBubble
                  ]}
                >
                  {message.role === 'ai' ? (
                    <Markdown style={markdownStyles}>
                      {message.text}
                    </Markdown>
                  ) : (
                    <Text style={styles.bubbleText}>{message.text}</Text>
                  )}
                </View>
              ))}

              {isLoading && (
                <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
                  <ActivityIndicator color={COLORS.text} size="small" />
                  <Text style={[styles.bubbleText, { marginLeft: 10 }]}>Advisor is thinking...</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Docked Chat Bar */}
          <View style={styles.bottomInputArea}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ask AI Advisor anything..."
                placeholderTextColor={COLORS.textSecondary}
                value={inputText}
                onChangeText={setInputText}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
              >
                <Text style={styles.sendIcon}>➔</Text>
              </TouchableOpacity>
            </View>

            {/* SOS Action - Now docked inside the bar */}
            <TouchableOpacity
              style={styles.sosButton}
              onPress={handleSOSPress}
              activeOpacity={0.7}
            >
              <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    paddingHorizontal: width * 0.05,
    paddingTop: 4,
    marginBottom: 5,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: Math.round(16 * width / 390),
    fontWeight: '500',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: Math.round(32 * width / 390),
    fontWeight: 'bold',
  },
  pulseCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: width * 0.05,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 6,
  },
  pulseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  pulseLabel: {
    color: COLORS.text,
    fontSize: Math.round(14 * width / 390),
    fontWeight: '600',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ecc71',
  },
  pulseStatus: {
    color: COLORS.textSecondary,
    fontSize: Math.round(12 * width / 390),
    lineHeight: 18,
  },
  chatContainer: {
    flex: 1,
    marginHorizontal: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 15,
    marginBottom: 5,
  },
  advisorTitle: {
    color: COLORS.text,
    fontSize: Math.round(10 * width / 390),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
    opacity: 0.4,
  },
  chatArea: {
    flex: 1,
  },
  chatScrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  bubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
  },
  aiBubble: {
    backgroundColor: COLORS.surfaceVariant,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.secondary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubbleText: {
    color: COLORS.text,
    fontSize: Math.round(14 * width / 390),
    lineHeight: 20,
  },
  bottomInputArea: {
    width: '100%',
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: Platform.OS === 'ios' ? 25 : 8, // More padding for iOS home indicator, minimal for Android
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    color: COLORS.text,
    marginRight: 8,
    height: 40,
  },
  sendButton: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    color: COLORS.text,
    fontSize: Math.round(14 * width / 390),
    fontWeight: 'bold',
  },
  sosButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sosText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: Math.round(12 * width / 390),
  },
});
