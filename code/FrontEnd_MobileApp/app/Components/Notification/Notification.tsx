import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';

const tones = ['Default', 'Soft Chime', 'Nature Ding', 'Alert Buzz'];

const Notification = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTone, setSelectedTone] = useState('Default');

  const toggleSwitch = () => setNotificationsEnabled(previous => !previous);

  const handleToneSelect = (tone) => {
    setSelectedTone(tone);
    Alert.alert('Tone Selected', `You selected "${tone}" as your notification tone.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification Settings</Text>

      {/* Enable/Disable Notifications */}
      <View style={styles.row}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleSwitch}
          thumbColor={notificationsEnabled ? '#01694D' : '#666'}
          trackColor={{ false: '#444', true: '#04b383' }}
        />
      </View>

      {/* Notification Tone Selection */}
      <Text style={styles.subHeader}>Notification Tone</Text>
      {tones.map((tone, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleToneSelect(tone)}
          style={[
            styles.toneOption,
            selectedTone === tone && styles.toneSelected,
          ]}
        >
          <Text style={styles.toneText}>
            {selectedTone === tone ? '✔ ' : ''}{tone}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012A1C',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: '#fff',
  },
  subHeader: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
  },
  toneOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#013427',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  toneText: {
    color: '#ccc',
    fontSize: 16,
  },
  toneSelected: {
    borderColor: '#01694D',
    backgroundColor: '#014f36',
  },
});

export default Notification;
