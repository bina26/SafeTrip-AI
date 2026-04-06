import { useState, useRef, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from 'expo-audio';
import { uploadEvidence } from '../utils/cloudinaryUpload';

export interface TransparentEvidenceState {
  isRecording: boolean;
  elapsedSeconds: number;
  /** Local on-device URI of the saved recording */
  savedUri: string | null;
  /** Public Cloudinary URL after a successful upload */
  cloudUrl: string | null;
  isUploading: boolean;
}

export interface TransparentEvidenceHook extends TransparentEvidenceState {
  startSafetyLog: () => Promise<void>;
  /** Stops the recording, uploads to Cloudinary, and returns the secure cloud URL. */
  stopSafetyLog: () => Promise<string | null>;
}

export function useTransparentEvidence(): TransparentEvidenceHook {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [savedUri, setSavedUri] = useState<string | null>(null);
  const [cloudUrl, setCloudUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // expo-audio recorder instance — stable across renders via the hook
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startSafetyLog = useCallback(async () => {
    // Step 1: Request microphone permissions via expo-audio
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Microphone Access Required',
        'SafeTrip AI needs microphone access to record a safety log. Please enable it in your device settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // Step 2: Configure audio session for recording
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Step 3: Prepare the recorder then start
      await recorder.prepareToRecordAsync();
      await recorder.record();

      setSavedUri(null);
      setCloudUrl(null);
      setElapsedSeconds(0);
      setIsRecording(true);

      // Step 4: Start live elapsed timer
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('[SafetyLog] Failed to start recording:', error);
      Alert.alert('Recording Error', 'Could not start the safety log. Please try again.');
    }
  }, [recorder]);

  const stopSafetyLog = useCallback(async (): Promise<string | null> => {
    // Stop the live timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    let localUri: string | null = null;

    try {
      // Stop the recording — uri is available on the recorder object after stop
      await recorder.stop();
      localUri = recorder.uri ?? null;

      setIsRecording(false);

      if (localUri) {
        setSavedUri(localUri);
      }

      // Reset audio session
      await setAudioModeAsync({ allowsRecording: false });
    } catch (error) {
      console.error('[SafetyLog] Failed to stop recording:', error);
      setIsRecording(false);
      return null;
    }

    // --- Auto-upload to Cloudinary ---
    if (!localUri) return null;

    setIsUploading(true);
    try {
      const result = await uploadEvidence(localUri);

      setCloudUrl(result.secureUrl);
      console.log('[SafetyLog] ✅ Evidence uploaded to Cloudinary:', result.secureUrl);

      return result.secureUrl;
    } catch (uploadError) {
      console.error('[SafetyLog] ❌ Cloudinary upload failed:', uploadError);
      Alert.alert(
        'Upload Failed',
        'The safety log was saved locally but could not be uploaded. Check your connection and try again.'
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [recorder]);

  return {
    isRecording,
    elapsedSeconds,
    savedUri,
    cloudUrl,
    isUploading,
    startSafetyLog,
    stopSafetyLog,
  };
}
