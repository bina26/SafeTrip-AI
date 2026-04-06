import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import SafetyLogRecorder from '../../components/SafetyLogRecorder';
import {
  ActivityIndicator,
  Alert,
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
import { useRouter } from 'expo-router';

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
    fontSize: 16,
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>SafeTrip AI</Text>

      {/* Welcome Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome 👋</Text>
        <Text style={styles.cardText}>
          Stay safe while traveling. Use the tools below when needed.
        </Text>
      </View>

      {/* Fake Call Button */}
      <TouchableOpacity
        style={styles.fakeCallBtn}
        onPress={() => router.push("/fake-call")}
      >
        <Text style={styles.btnText}>📞 Fake Call / Escape Mode</Text>
      </TouchableOpacity>

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
      <TouchableOpacity onPress={() => setRecorderVisible(true)} style={{ backgroundColor:'#1a0a0a', borderRadius:12, padding:14, alignItems:'center', marginTop:12, marginHorizontal:20, borderWidth:1, borderColor:'#4a1a1a', marginBottom:10 }}>
        <Text style={{ color:'#e63946', fontSize:15, fontWeight:'600' }}>🎙 Safety Log</Text>
      </TouchableOpacity>

      <Modal visible={recorderVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setRecorderVisible(false)}>
        <View style={{ flex:1, backgroundColor:'#0a0a0a', padding:20 }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:20, paddingTop:10 }}>
            <Text style={{ fontSize:20, fontWeight:'bold', color:'#fff' }}>Safety Log Recorder</Text>
            <TouchableOpacity onPress={() => setRecorderVisible(false)}>
              <Text style={{ color:'#666', fontSize:14 }}>X Close</Text>
            </TouchableOpacity>
          </View>
          <SafetyLogRecorder />
        </View>
      </Modal>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A192F",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#112240",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 5,
  },
  cardText: {
    color: "#aaa",
  },
  fakeCallBtn: {
    backgroundColor: "#FF8C00",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pulseCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  pulseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pulseLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2ecc71',
  },
  pulseStatus: {
    color: '#9a8c98',
    fontSize: 13,
  },
  chatContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 12,
  },
  advisorTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  chatArea: {
    flex: 1,
    maxHeight: 300,
  },
  chatScrollContent: {
    paddingBottom: 12,
  },
  bubble: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    maxWidth: '85%',
  },
  aiBubble: {
    backgroundColor: '#16213e',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#0f3460',
    alignSelf: 'flex-end',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubbleText: {
    color: '#ffffff',
    fontSize: 15,
  },
  bottomInputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 20,
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0f3460',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    paddingVertical: 12,
  },
  sendButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#1a1a2e',
  },
  sendIcon: {
    color: '#ffffff',
    fontSize: 16,
  },
  sosButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});