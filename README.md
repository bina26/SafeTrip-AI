<div align="center">

# 🛡️ SafeTrip-AI

### *Your AI-powered personal safety companion, built for travelers who refuse to compromise.*

[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo%20SDK%2054-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%203.1%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey?style=for-the-badge&logo=android)](https://expo.dev)

</div>

---

## 📖 Project Overview

Every year, millions of tourists find themselves in unfamiliar environments with no rapid access to emergency services, no local safety knowledge, and no discreet way to call for help. **SafeTrip-AI** solves this.

It's a mobile-first emergency toolkit that puts **real-time AI insights**, **one-tap SOS dispatch**, **crisis-mapped surroundings**, and **covert safety tools** directly into a traveler's pocket — and it still works **fully offline** when it matters most.

> Built for hackathons, built for the real world.

---

## ✨ Key Features

- 🤖 **AI Safety Advisor** — A live Gemini-powered chatbot trained to deliver hyper-localized travel safety tips, local scam alerts, and situational guidance instantly.
- 🗺️ **Live Crisis Map** — An interactive dark-themed Google Map overlaid with AI-generated risk zone circles (High / Medium / Low) and real-time nearby Emergency Services (Hospitals 🏥, Police 🚓, Pharmacies 💊) pulled from the Google Places API.
- 🫨 **Shake-to-SOS Panic Gesture** — Uses the device accelerometer physics engine (force > 1.8g threshold) to silently detect a distress shake and immediately trigger an SOS confirmation alert — no button tap needed.
- 🆘 **Instant SOS Dispatch** — Automatically pulls all saved emergency contacts, captures a live GPS coordinate link, and pre-fills native Android SMS with a one-click distress message.
- 📞 **Fake Call Emulator** — Generates a pixel-perfect, animated Android incoming call screen (with a real audio ringtone loop) to provide a discreet "exit strategy" in unsafe situations.
- 🎙️ **Evidence Vault (Safety Logger)** — Records high-quality audio evidence with a live pulsing "RECORDING ACTIVE" indicator, then automatically uploads the file to Cloudinary with a shareable secure URL.
- 🎒 **Offline Emergency Kit** — Full First-Aid procedures (CPR, Heimlich, Seizure, Heatstroke etc.) and tappable emergency numbers for 10+ countries — no internet required.
- 👤 **Unified Profile Sync** — User data (name, blood group, emergency contacts) is written once during onboarding and instantly available across every screen in the app.

---

## 🔒 Privacy-First Architecture

SafeTrip-AI was deliberately built with a **serverless, database-free architecture**. There is no backend server, no user account system, and no cloud database.

| What we chose | Why |
|---|---|
| `AsyncStorage` (on-device) | User profile data never leaves their phone |
| Cloudinary **Unsigned Preset** | Audio evidence uploads with no exposed API secret |
| Gemini API (stateless calls) | Each query is independent — no conversation history stored |
| Google Places API (stateless calls) | Location queries are one-shot; coordinates are never persisted |

> **Your identity, location, and recordings are yours alone.**  
> The app does not track, store, or transmit any personal data to any proprietary server.

---

## 🛠️ Tech Stack

### Frontend & Framework
| Layer | Technology | Version |
|---|---|---|
| App Framework | Expo | SDK 54 |
| UI Language | React Native + TypeScript | 0.81.5 / 5.9 |
| Navigation | Expo Router (file-based) | ~6.0.23 |
| Styling | React Native StyleSheet + LinearGradient | — |

### APIs & Cloud Services
| Service | Purpose |
|---|---|
| **Google Gemini 3.1 Flash** | AI Safety Advisor + Risk Zone generation |
| **Google Maps Platform** | Map rendering + Nearby Places Search |
| **Cloudinary** | Serverless audio evidence storage |

### Hardware / Native Modules
| Module | Feature |
|---|---|
| `expo-sensors` (Accelerometer) | Shake-to-SOS panic gesture |
| `expo-location` | Live GPS coordinates for SOS SMS |
| `expo-sms` | Native SMS dispatch to emergency contacts |
| `expo-audio` | Safety Log recording + Fake Call ringtone |
| `expo-image-picker` | Profile photo selection |

---

## 🚀 Local Setup & Installation

> **Prerequisites:** Node.js ≥ 18, Expo CLI, and the **Expo Go** app (or an Android emulator).

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/SafeTrip-AI.git
cd SafeTrip-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your environment variables

```bash
cp .env.example .env
# Then open .env and fill in your API keys (see section below)
```

### 4. Start the development server

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your Android or iOS device to run the app instantly.

### 5. Build an Android APK (optional)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Trigger a production preview build
eas build -p android --profile preview
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following keys. **Never commit your actual keys to version control.**

```env
# .env.example — Copy this file to .env and fill in your values

# Google Gemini API Key (for AI Safety Advisor and Risk Zone generation)
# Get yours at: https://aistudio.google.com/
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps API Key (for map rendering and Nearby Places Search)
# Enable: Maps SDK for Android + Places API
# Get yours at: https://console.cloud.google.com/
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Cloudinary Cloud Name (for safety evidence audio uploads)
# Get yours at: https://cloudinary.com/
# Also create an unsigned upload preset named: safetrip_evidence
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
```

> ⚠️ **Important:** The `.env` file is listed in `.gitignore` and will never be committed. The `app.config.js` file reads these values at build time and injects them securely into the native Android binary.

---

## 📁 Project Structure

```
SafeTrip-AI/
├── app.config.js              # Expo config with env variable injection
├── .env                       # Local secrets (gitignored)
│
├── app/
│   ├── _layout.tsx            # Root stack navigator
│   ├── index.tsx              # Entry router (onboarding or dashboard)
│   ├── fake-call.tsx          # Full-screen fake call screen
│   ├── onboarding/
│   │   └── index.tsx          # 3-step user setup wizard
│   └── (tabs)/
│       ├── _layout.tsx        # Bottom tab bar configuration
│       ├── dashboard.tsx      # AI chat, SOS, Safety Log, Fake Call
│       ├── map.tsx            # Live safety map with risk zones
│       ├── offline.tsx        # Offline First Aid & Emergency Numbers
│       └── profile.tsx        # User settings and emergency contacts
│
├── components/
│   └── SafetyLogRecorder.tsx  # Audio recording UI component
│
├── hooks/
│   ├── usePanicGesture.ts     # Accelerometer shake-to-SOS logic
│   └── useTransparentEvidence.ts  # Audio recording + upload state manager
│
└── utils/
    ├── ai.ts                  # Gemini API wrappers (chat + risk zones)
    ├── cloudinaryUpload.ts    # Serverless audio upload utility
    └── storage.ts             # AsyncStorage profile read/write wrappers
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

<div align="center">

**Built with ❤️ for travelers, by travelers.**

*Stay aware. Stay safe. SafeTrip-AI.*

</div>
