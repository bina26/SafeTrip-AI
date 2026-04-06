import { Tabs } from "expo-router";
import { Image } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadImage();
  }, []);

  const loadImage = async () => {
    try {
      const data = await AsyncStorage.getItem("profile");
      if (data) {
        const parsed = JSON.parse(data);
        setProfileImage(parsed.image || null);
      }
    } catch (e) {
      console.log("Error loading image:", e);
    }
  };

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Safety Map",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size }) =>
            profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                }}
              />
            ) : (
              <Ionicons name="person-circle" size={size} color="#ccc" />
            ),
        }}
      />
    </Tabs>
  );
}
