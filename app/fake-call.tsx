import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function FakeCallScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.incoming}>Incoming Call...</Text>

            <Text style={styles.name}>Mom</Text>

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "green" }]}
                    onPress={() => alert("Call Accepted")}
                >
                    <Text style={styles.text}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "red" }]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.text}>Decline</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    incoming: {
        color: "#aaa",
        fontSize: 18,
    },
    name: {
        color: "#fff",
        fontSize: 40,
        marginVertical: 20,
    },
    buttons: {
        flexDirection: "row",
        marginTop: 40,
    },
    btn: {
        padding: 20,
        borderRadius: 50,
        marginHorizontal: 20,
    },
    text: {
        color: "#fff",
        fontWeight: "bold",
    },
});