# SafeTrip AI - Project Overview

## 1. The Elevator Pitch
**SafeTrip AI** is a modern tourist safety companion built with React Native and Expo. It aims to provide AI-powered safety insights, real-time neighborhood risk analysis, and immediate SOS functionality to travelers in unfamiliar territories. Core features include an interactive safety heatmap, an AI advisor for localized safety tips, and a quick-response emergency communication system.

## 2. Tech Stack & Dependencies
*   **Primary Language:** TypeScript
*   **Framework:** React Native with Expo (Managed Workflow)
*   **Routing:** Expo Router (File-based navigation)
*   **Styling:** React Native Dynamic Styles (Dark Navy Theme)

### Dependencies (package.json)
```json
{
  "name": "safetripai",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "expo": "~54.0.33",
    "expo-constants": "~18.0.13",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-linking": "~8.0.11",
    "expo-router": "~6.0.23",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-worklets": "0.5.1",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "~0.21.0"
  }
}
```

## 3. Directory Structure
```text
SafeTripAI/
├── app/
│   ├── _layout.tsx         # Root layout with Stack navigation
│   └── index.tsx           # Entry screen / Onboarding portal
├── assets/
│   ├── images/             # Static assets and icons
│   └── fonts/              # Custom typography
├── components/             # Reusable UI components
├── constants/              # Global theme and configuration
├── hooks/                  # Custom React hooks
├── app-example/            # Reference implementation (Tabs, Modal)
├── package.json            # Project manifest
├── tsconfig.json           # TypeScript configuration
└── app.json                # Expo configuration
```

## 4. Entry Point & Core Configuration
The app uses **Expo Router** with the entry point set to `expo-router/entry` in `package.json`.

### Root Layout (`app/_layout.tsx`)
```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

### Main Entry Screen (`app/index.tsx`)
```tsx
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
```

## 5. Routing Logic & State
The project has been initialized with a file-based routing system. A more complex reference implementation resides in `app-example/`, showcasing tab-based navigation and modal screens.

## 6. Current State & Blockers
*   **Current State:** The project has been successfully initialized as an Expo Router application. The basic scaffolding for the UI and navigation is set up.
*   **Accomplishments:** Integrated all necessary Expo SDK 54 dependencies, including styling and navigation libraries.
*   **Next Steps:**
    *   Re-implement the **3-step onboarding flow** (Welcome -> Features -> Setup).
    *   Integrate **AsyncStorage** for persistent user data (name, blood group, emergency contact).
    *   Develop the **SOS Trigger View** and **AI Safety Advisor** dashboard.
    *   Configure the **Google Maps SDK** or **MapLibre** for the safety heatmap.
*   **Blockers:** No major technical blockers. Ready for feature implementation.
