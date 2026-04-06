import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>SafeTrip AI</Text>

      {/* Welcome Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome 👋</Text>
        <Text style={styles.cardText}>
          Stay safe while traveling. Use the tools below when needed.
        </Text>
      </View>

      {/* Fake Call Button */}
      <TouchableOpacity
        style={styles.fakeCallBtn}
        onPress={() => router.push("/fake-call")}
      >
        <Text style={styles.btnText}>📞 Fake Call / Escape Mode</Text>
      </TouchableOpacity>

      {/* SOS Button (optional placeholder) */}
      <TouchableOpacity
        style={styles.sosBtn}
        onPress={() => alert("SOS Triggered")}
      >
        <Text style={styles.btnText}>🚨 SOS Emergency</Text>
      </TouchableOpacity>

      {/* Map Button (optional navigation) */}
      <TouchableOpacity
        style={styles.mapBtn}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.btnText}>🗺️ Open Safety Map</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A192F",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#112240",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 5,
  },
  cardText: {
    color: "#aaa",
  },
  fakeCallBtn: {
    backgroundColor: "#FF8C00",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  sosBtn: {
    backgroundColor: "#E63946",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  mapBtn: {
    backgroundColor: "#1F6FEB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});