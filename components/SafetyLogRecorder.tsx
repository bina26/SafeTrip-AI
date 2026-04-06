import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTransparentEvidence } from '../hooks/useTransparentEvidence';

// Formats seconds into MM:SS display
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SafetyLogRecorder() {
  const { isRecording, elapsedSeconds, savedUri, cloudUrl, isUploading, startSafetyLog, stopSafetyLog } =
    useTransparentEvidence();

  // Pulsing animation for the recording indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isRecording) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
    return () => pulseLoop.current?.stop();
  }, [isRecording, pulseAnim]);

  const handleToggle = async () => {
    if (isRecording) {
      await stopSafetyLog();
    } else {
      await startSafetyLog();
    }
  };

  return (
    <View style={styles.container}>
      {/* Live Recording Indicator - only visible while recording */}
      {isRecording && (
        <View style={styles.indicatorBanner}>
          <Animated.View
            style={[styles.pulsingDot, { transform: [{ scale: pulseAnim }] }]}
          />
          <Text style={styles.indicatorText}>🔴 RECORDING ACTIVE</Text>
          <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
        </View>
      )}

      {/* Main Toggle Button */}
      <TouchableOpacity
        style={[styles.button, isRecording ? styles.buttonStop : styles.buttonStart]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonIcon}>{isRecording ? '⏹' : '⏺'}</Text>
        <Text style={styles.buttonLabel}>
          {isRecording ? 'Stop Safety Log' : 'Start Safety Log'}
        </Text>
      </TouchableOpacity>

      {/* Uploading spinner */}
      {isUploading && (
        <View style={styles.uploadingBanner}>
          <Text style={styles.uploadingText}>⬆️  Uploading to Cloudinary...</Text>
        </View>
      )}

      {/* Cloud URL confirmation */}
      {cloudUrl && !isUploading && (
        <View style={styles.cloudCard}>
          <Text style={styles.cloudTitle}>☁️ Uploaded to Cloudinary</Text>
          <Text style={styles.cloudUrl} numberOfLines={3} selectable>
            {cloudUrl}
          </Text>
        </View>
      )}

      {/* Saved URI confirmation */}
      {savedUri && !isRecording && (
        <View style={styles.uriCard}>
          <Text style={styles.uriTitle}>✅ Safety Log Saved Locally</Text>
          <Text style={styles.uriText} numberOfLines={3} selectable>
            {savedUri}
          </Text>
        </View>
      )}

      {/* Informational note for user transparency */}
      {!isRecording && !savedUri && (
        <Text style={styles.hint}>
          Tap "Start Safety Log" to begin a transparent, visible recording session to
          document your surroundings for safety purposes.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  indicatorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#3d0000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#e74c3c',
    width: '100%',
    justifyContent: 'center',
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e74c3c',
  },
  indicatorText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  timerText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    marginLeft: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonStart: {
    backgroundColor: '#27ae60',
  },
  buttonStop: {
    backgroundColor: '#e74c3c',
  },
  buttonIcon: {
    fontSize: 22,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  uriCard: {
    backgroundColor: 'rgba(39, 174, 96, 0.12)',
    borderWidth: 1,
    borderColor: '#27ae60',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    gap: 6,
  },
  uriTitle: {
    color: '#2ecc71',
    fontWeight: 'bold',
    fontSize: 14,
  },
  uriText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  hint: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  uploadingBanner: {
    backgroundColor: 'rgba(52, 152, 219, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.4)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 14,
  },
  cloudCard: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    gap: 6,
  },
  cloudTitle: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cloudUrl: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
