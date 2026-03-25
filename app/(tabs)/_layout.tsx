import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#9a8c98',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🛡️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Safety Map',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🗺️</Text>
          ),
        }}
      />
    </Tabs>
  );
}
