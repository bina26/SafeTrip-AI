import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile, saveUserProfile } from "../../utils/storage";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [contacts, setContacts] = useState<string[]>([""]);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load core fields from the shared onboarding key
      const coreProfile = await getUserProfile();
      if (coreProfile) {
        setName(coreProfile.name || "");
        setBloodGroup(coreProfile.bloodGroup || "");
        // Seed the first contact slot from onboarding's emergencyContact
        if (coreProfile.emergencyContact) {
          setContacts([coreProfile.emergencyContact]);
        }
      }
      // Also load photo and any extra contacts stored by profile screen
      const extra = await AsyncStorage.getItem("profile");
      if (extra) {
        const parsed = JSON.parse(extra);
        setImage(parsed.image || null);
        // Only override contacts if profile screen has richer data
        if (parsed.contacts && parsed.contacts.length > 0) {
          setContacts(parsed.contacts);
        }
      }
    } catch (e) {
      console.log("Load error:", e);
    }
  };

  const saveData = async () => {
    try {
      // Save core fields via shared storage utility (syncs with dashboard & onboarding)
      const success = await saveUserProfile({
        name,
        bloodGroup,
        emergencyContact: contacts[0] || "",
      });
      // Save photo and full contacts list under the profile key
      await AsyncStorage.setItem(
        "profile",
        JSON.stringify({ name, bloodGroup, contacts, image })
      );
      if (success) {
        Alert.alert("Success", "Profile saved!");
      } else {
        Alert.alert("Error", "Failed to save profile. Please try again.");
      }
    } catch (e) {
      console.log("Save error:", e);
    }
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log("Image error:", e);
    }
  };

  const updateContact = (text: string, index: number) => {
    const newContacts = [...contacts];
    newContacts[index] = text;
    setContacts(newContacts);
  };

  const addContact = () => {
    setContacts([...contacts, ""]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Profile Image */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={{ color: "#aaa" }}>Add Photo</Text>
        )}
      </TouchableOpacity>

      {/* Name */}
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      {/* Blood Group */}
      <TextInput
        style={styles.input}
        placeholder="Blood Group (e.g. O+)"
        placeholderTextColor="#888"
        value={bloodGroup}
        onChangeText={setBloodGroup}
      />

      {/* Contacts */}
      <Text style={styles.section}>Emergency Contacts</Text>

      {contacts.map((contact, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Contact ${index + 1}`}
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={contact}
          onChangeText={(text) => updateContact(text, index)}
        />
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addContact}>
        <Text style={styles.btnText}>+ Add Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={saveData}>
        <Text style={styles.btnText}>Save Profile</Text>
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
    fontSize: 26,
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#112240",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  section: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 10,
  },
  addBtn: {
    backgroundColor: "#1F6FEB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  saveBtn: {
    backgroundColor: "#2EA043",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageBox: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#112240",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});