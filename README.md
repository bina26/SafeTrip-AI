# 🛡️ SafeTrip AI

SafeTrip AI is an intelligent, reactive personal safety and travel companion app. Designed with a focus on high-stress, low-light environments, the app combines real-time location tracking, an AI-powered chat assistant, and rapid-response emergency protocols into a single, tactical interface.

## ✨ Features (MVP Phase)

* **📍 Live Safety Map:** * Real-time GPS tracking utilizing native device hardware.
  * Dynamic, proximity-based "High Risk Area" rendering.
  * Custom-built camera controls for immediate re-centering.
* **🚨 One-Touch SOS Protocol:** * Prominent dashboard trigger with accidental-dial prevention.
  * Direct integration with native OS phone dialers for emergency services.
* **🧠 AI Travel Assistant:** * Integrated conversational AI interface to act as a proactive safety companion.
* **🌙 Tactical Dark Theme:** * Custom `#1A2232` navy UI optimized to preserve night vision and battery life during travel.

## 🛠️ Tech Stack

* **Framework:** React Native / Expo
* **Navigation:** Expo Router (File-based routing)
* **Mapping:** `react-native-maps` & Google Maps SDK
* **Hardware APIs:** `expo-location`, `Linking` (Native Dialer)
* **Build System:** Expo Application Services (EAS)

## 🚀 Getting Started

To run this project locally on your machine:

### 1. Clone the repository

    git clone https://github.com/YOUR_USERNAME/SafeTrip-AI.git
    cd SafeTrip-AI

### 2. Install dependencies

    npm install

### 3. API Key Configuration
To run the map on a physical Android device, you must provide your own Google Maps API Key.
* Add your key to `app.json` under `android.config.googleMaps.apiKey`.

### 4. Start the development server

    npx expo start

## 🗺️ Roadmap
* *Upcoming features to be determined...*
