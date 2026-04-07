import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Platform,
  Linking
} from 'react-native';

const emergencyNumbers = [
  { country: 'India', numbers: '100, 108, 112' },
  { country: 'USA', numbers: '911' },
  { country: 'UK', numbers: '999' },
  { country: 'Australia', numbers: '000' },
  { country: 'Germany', numbers: '110, 112' },
  { country: 'France', numbers: '17, 15, 112' },
  { country: 'Japan', numbers: '110, 119' },
  { country: 'Singapore', numbers: '999, 995' }
];

const firstAidData = [
  { title: 'CPR', description: 'Call 112, 30 compressions, 2 breaths' },
  { title: 'Heavy Bleeding', description: 'Press firmly, elevate' },
  { title: 'Burns', description: 'Cool water 20 mins, loosely cover' }
];

const tipsData = [
  'Share location',
  'Keep battery > 30%',
  'Keep cash separate',
  'Memorise hotel address',
  'Trust instincts'
];

export default function OfflineScreen() {
  const [activeTab, setActiveTab] = useState('Numbers');

  const renderTab = (title: string) => (
    <TouchableOpacity 
      style={[styles.tab, activeTab === title && styles.activeTab]}
      onPress={() => setActiveTab(title)}
    >
      <Text style={[styles.tabText, activeTab === title && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Numbers':
        return emergencyNumbers.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.country}</Text>
            <View style={styles.cardValueContainer}>
              {item.numbers.split(', ').map((num, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.numberButton}
                  onPress={() => Linking.openURL(`tel:${num}`)}
                >
                  <Text style={styles.cardValue}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ));
      case 'First Aid':
        return firstAidData.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        ));
      case 'Tips':
        return (
          <View style={styles.card}>
            {tipsData.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#12141A" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Kit</Text>
        <Text style={styles.headerSubtitle}>Crucial info accessible without internet</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓ Works Offline</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {renderTab('Numbers')}
        {renderTab('First Aid')}
        {renderTab('Tips')}
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#12141A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A0AAB2',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(240, 90, 83, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F05A53',
  },
  badgeText: {
    color: '#F05A53',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tab: {
    marginRight: 24,
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#F05A53',
  },
  tabText: {
    color: '#A0AAB2',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1E222D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardValueContainer: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  numberButton: {
    borderWidth: 1,
    borderColor: '#e63946',
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
    marginBottom: 6,
  },
  cardValue: {
    color: '#F05A53',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardDescription: {
    color: '#A0AAB2',
    fontSize: 15,
    lineHeight: 24,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F05A53',
    marginTop: 6,
    marginRight: 12,
  },
  tipText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  }
});
