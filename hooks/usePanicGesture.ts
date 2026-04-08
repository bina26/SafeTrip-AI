import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Alert } from 'react-native';

const SHAKE_THRESHOLD = 1.8;
const SHAKE_TIMEOUT = 3000;

export const usePanicGesture = (onPanicDetected: () => void) => {
  const lastShake = useRef(0);
  const subRef = useRef<any>(null);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    
    subRef.current = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (force > SHAKE_THRESHOLD && now - lastShake.current > SHAKE_TIMEOUT) {
        lastShake.current = now;
        Alert.alert(
          "Panic Gesture Detected",
          "Shake detected! Send emergency SOS?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Send SOS", onPress: onPanicDetected }
          ]
        );
      }
    });

    return () => {
      subRef.current?.remove();
    };
  }, [onPanicDetected]);
};
