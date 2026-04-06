import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRiskZones, RiskZone } from '../../utils/ai';

const { width, height } = Dimensions.get('window');

const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
  { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function checkDangerZone(lat: number, lng: number, zones: RiskZone[]) {
  for (const zone of zones) {
    const dist = getDistanceMeters(lat, lng, zone.lat, zone.lng);
    if (dist <= zone.radius && zone.risk === "high") {
      Alert.alert(
        "⚠️ Danger Zone Alert",
        `You are near ${zone.title}: ${zone.description}. Please stay alert and consider moving to a safer area.`
      );
      return;
    }
  }
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setLoading(false);
      setRegion({
        latitude: 48.8606,
        longitude: 2.3376,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(newRegion);
      // If map is already loaded, animate to the new location
      mapRef.current?.animateToRegion(newRegion, 1000);
      
      const zones = await getRiskZones(location.coords.latitude, location.coords.longitude);
      setRiskZones(zones);
      checkDangerZone(location.coords.latitude, location.coords.longitude, zones);
    } catch (error) {
      console.warn('Error fetching location:', error);
      if (!region) {
        setRegion({
          latitude: 48.8606,
          longitude: 2.3376,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleCenter = () => {
    if (region) {
      mapRef.current?.animateToRegion(region, 1000);
    } else {
      fetchLocation();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Locating your safety zones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region || undefined}
        showsUserLocation={true}
        showsMyLocationButton={false}
        customMapStyle={DARK_MAP_STYLE}
      >
        {region && (
          <>
            {riskZones.map((z) => {
              const strokeColor = z.risk === 'high' ? '#e63946' : z.risk === 'medium' ? '#ffa500' : '#2dc653';
              const fillColor = z.risk === 'high' ? 'rgba(230,57,70,0.25)' : z.risk === 'medium' ? 'rgba(255,165,0,0.2)' : 'rgba(45,198,83,0.2)';
              
              return (
                <React.Fragment key={z.id}>
                  <Circle
                    center={{ latitude: z.lat, longitude: z.lng }}
                    radius={z.radius}
                    fillColor={fillColor}
                    strokeColor={strokeColor}
                    strokeWidth={2}
                  />
                </React.Fragment>
              );
            })}
          </>
        )}
      </MapView>

      <SafeAreaView style={styles.floatingHeaderArea}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Live Safety Map</Text>
          <View style={styles.statusIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>
              {errorMsg ? 'GPS Permission Denied' : 'Active Tracking Enabled'}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={handleCenter}
        activeOpacity={0.8}
      >
        <Text style={styles.centerButtonText}>📍 Re-center</Text>
      </TouchableOpacity>

      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
          <View style={[styles.legendCircle, { backgroundColor: '#e74c3c' }]} />
          <Text style={styles.legendText}>High Risk Area</Text>
        </View>
        <View style={[styles.legendRow, { marginTop: 8 }]}>
          <View style={[styles.legendCircle, { backgroundColor: '#ffa500' }]} />
          <Text style={styles.legendText}>Medium Risk Area</Text>
        </View>
        <View style={[styles.legendRow, { marginTop: 8 }]}>
          <View style={[styles.legendCircle, { backgroundColor: '#2dc653' }]} />
          <Text style={styles.legendText}>Low Risk Area</Text>
        </View>
        <View style={[styles.legendRow, { marginTop: 8 }]}>
          <View style={[styles.legendCircle, { backgroundColor: '#3498db' }]} />
          <Text style={styles.legendText}>You are here</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 20,
    fontSize: 16,
    opacity: 0.7,
  },
  floatingHeaderArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 10,
  },
  headerCard: {
    width: width * 0.9,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2ecc71',
    marginRight: 8,
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  centerButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
  centerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: 140,
    zIndex: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
    opacity: 0.8,
  },
  legendText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  markerContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
  },
});
