import 'dotenv/config';

export default {
  "expo": {
    "name": "SafeTripAI",
    "slug": "SafeTripAI",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "safetripai",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "backgroundColor": "#1a1a2e",
      "resizeMode": "contain"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "icon": "./assets/icon.png",
      "adaptiveIcon": {
        "backgroundColor": "#1a1a2e",
        "foregroundImage": "./assets/adaptive-icon.png"
      },
      "predictiveBackGestureEnabled": false,
      "softwareKeyboardLayoutMode": "resize",
      "package": "com.binzups.safetripai",
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE"
      ]
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-audio",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#1a1a2e",
          "dark": {
            "backgroundColor": "#1a1a2e"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "b158a1aa-85f1-41c5-996b-965ee134d600"
      }
    }
  }
};
