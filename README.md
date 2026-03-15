# 🛍️ E-Commerce Mini App

A production-quality e-commerce mobile application built with React Native (Expo) and TypeScript. Features include product browsing, cart management, user authentication, and Stripe payment integration.

## 📱 Demo



## 🏗️ Framework Choice: Why React Native + Expo?

I chose **React Native with Expo** for this project because:

- **Cross-platform**: Write once, run on both iOS and Android
- **Expo Managed Workflow**: 
  - Zero native code configuration
  - Over-the-air updates capability
  - Access to device APIs without native dependencies
  - Easy testing with Expo Go app
- **TypeScript Integration**: First-class support for type safety
- **Rich Ecosystem**: React Navigation, Context API, and extensive community support
- **Development Speed**: Hot reloading and quick iteration cycles
- **Production Ready**: Used by companies like Shopify, Pinterest, and UberEats

## 🚀 How to Run the App from Scratch

### Prerequisites
- Node.js (v16 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on physical device (optional)

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ecommerce-mini-app.git
cd ecommerce-mini-app

# 2. Install dependencies
npm install

# 3. Install Expo-specific dependencies
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install axios
npx expo install @expo/vector-icons
npx expo install @stripe/stripe-react-native
npx expo install react-native-gesture-handler

# 4. Start the development server
npx expo start

# 5. Run on your device
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code with Expo Go app for physical device
