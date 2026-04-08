import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { createAudioPlayer } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function FakeCallScreen() {
    const router = useRouter();
    const playerRef = useRef<any>(null);
    const [accepted, setAccepted] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const stopAudio = () => {
        try {
            if (playerRef.current) {
                playerRef.current.remove();
                playerRef.current = null;
            }
        } catch (e) {
            // silently ignore
        }
    };

    useEffect(() => {
        try {
            playerRef.current = createAudioPlayer("https://www.soundjay.com/phone/sounds/telephone-ring-01a.mp3");
            playerRef.current.loop = true;
            playerRef.current.play();
        } catch (e) {
            console.log("Audio failed to play:", e);
        }

        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.3,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        return () => {
            pulse.stop();
            stopAudio();
        };
    }, []);

    const handleDecline = () => {
        stopAudio();
        router.back();
    };

    const handleAccept = () => {
        stopAudio();
        setAccepted(true);
        setTimeout(() => {
            router.back();
        }, 2000);
    };

    return (
        <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.container}>
            {/* Header section */}
            <View style={styles.header}>
                <Text style={styles.incoming}>{accepted ? '00:00' : 'Incoming call'}</Text>
                <Text style={styles.name}>Mom</Text>
                <Text style={styles.number}>+91 98765 43210</Text>
            </View>

            {/* Avatar section */}
            <View style={styles.avatarContainer}>
                {!accepted && (
                    <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], opacity: 0.6 }]} />
                )}
                {!accepted && (
                    <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], opacity: 0.3 }]} />
                )}
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>M</Text>
                </View>
            </View>

            {/* Actions section */}
            <View style={styles.actionsContainer}>
                {!accepted ? (
                    <View style={styles.buttonRow}>
                        <View style={styles.actionItem}>
                            <TouchableOpacity style={[styles.circularBtn, { backgroundColor: '#333' }]}>
                                <Ionicons name="chatbubble" size={28} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.actionLabel}>Message</Text>
                        </View>

                        <View style={styles.actionItem}>
                            <TouchableOpacity style={[styles.circularBtn, { backgroundColor: '#e63946', width: 72, height: 72, borderRadius: 36 }]} onPress={handleDecline}>
                                <MaterialIcons name="call-end" size={32} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.actionLabel}>Decline</Text>
                        </View>

                        <View style={styles.actionItem}>
                            <TouchableOpacity style={[styles.circularBtn, { backgroundColor: '#2ecc71', width: 72, height: 72, borderRadius: 36 }]} onPress={handleAccept}>
                                <MaterialIcons name="call" size={32} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.actionLabel}>Accept</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.buttonRowCenter}>
                        <View style={styles.actionItem}>
                            <TouchableOpacity style={[styles.circularBtn, { backgroundColor: '#e63946', width: 72, height: 72, borderRadius: 36 }]} onPress={handleDecline}>
                                <MaterialIcons name="call-end" size={32} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.actionLabel}>End call</Text>
                        </View>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 80,
    },
    header: {
        alignItems: "center",
        marginTop: 20,
    },
    incoming: {
        color: "#aaa",
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
    },
    name: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 8,
    },
    number: {
        color: "#888",
        fontSize: 18,
    },
    avatarContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "#00838f", // Teal/Google style
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
    },
    avatarText: {
        color: "#fff",
        fontSize: 60,
        fontWeight: "300",
    },
    pulseCircle: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "#00838f",
        zIndex: 1,
    },
    actionsContainer: {
        width: '100%',
        paddingHorizontal: 30,
        marginBottom: 40,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: '100%',
    },
    buttonRowCenter: {
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
    },
    actionItem: {
        alignItems: "center",
        justifyContent: "center",
    },
    circularBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    actionLabel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: '500',
    },
});