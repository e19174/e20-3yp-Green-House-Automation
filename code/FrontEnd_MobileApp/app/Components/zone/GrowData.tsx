import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CircularProgressBase  } from 'react-native-circular-progress-indicator';
import { Axios } from '../../AxiosRequestBuilder';
import { themeAuth } from '../../../Contexts/ThemeContext';
import { useFocusEffect } from 'expo-router';


interface GrowDataItem {
  name: string;
  value: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  percentage: number;
}

interface GrowDataProps {
  deviceId: number | undefined;
}

const GrowData: React.FC<GrowDataProps> = ({deviceId}) => {
  const { theme } = themeAuth();
  const [growDataItems, setGrowDataItems] = useState<GrowDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useFocusEffect(
  React.useCallback(() => {
    let isActive = true;
    const fetchSensorData = async () => {
      try {
        const response = await Axios.get(`/sensors/currentData/${deviceId}`);
        const sensorData = response.data
        console.log(sensorData);
        const formattedData: GrowDataItem[] = [
          { name: 'Temp', value: `${sensorData.temperature}`, unit: '°C', icon: 'thermometer', percentage: (sensorData.temperature || 0) / 50 },
          { name: 'Humidity', value: `${sensorData.humidity}`, unit: '%', icon: 'water', percentage: (sensorData.humidity || 0) / 100 },
          { name: 'Soil Moisture', value: `${sensorData.soilMoisture}`, unit: '%', icon: 'leaf', percentage: (sensorData.soilMoisture || 0) / 3000 },
          { name: 'N Level', value: `${sensorData.nitrogenLevel}`, unit: 'ppm', icon: 'flask', percentage: (sensorData.nitrogenLevel || 0) / 0.00125 },
          { name: 'P Level', value: `${sensorData.phosphorusLevel}`, unit: 'ppm', icon: 'flask', percentage: (sensorData.phosphorusLevel || 0) / 0.00125 },
          { name: 'K Level', value: `${sensorData.potassiumLevel}`, unit: 'ppm', icon: 'flask', percentage: (sensorData.potassiumLevel || 0) / 0.00125 },
        ];
        setGrowDataItems(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        setError('Failed to load data');
      }
    }
    const intervalId = setInterval(() => {
      if (!isActive) return;
      fetchSensorData();
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
      isActive = false;
    }
  }, [])
);

  if (loading) {
    return <ActivityIndicator size="large" color="#16F08B" />;
  }

  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;
  }

  const firstRow = growDataItems.slice(0, 3);
  const secondRow = growDataItems.slice(3, 6);

  return (
    <View style={[styles.growDataSection, { backgroundColor: theme.colors.primary }]}>
      <Text style={styles.growDataMainTitle}>GROW DATA</Text>

      <View style={styles.rowContainer}>
        {firstRow.map((item, index) => (
          <View key={index} style={styles.growDataItem}>
            <Text style={styles.growDataTitle}>{item.name}</Text>
            <CircularProgressBase
              value={(item.percentage || 0) * 100} // Convert to 0-100%
              radius={40}
              duration={1000}
              
              activeStrokeColor="#16F08B"
              inActiveStrokeColor="#01694D"
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={5}
              inActiveStrokeWidth={5}
            >
              <View style={styles.iconOverlay}>
                <Text style={styles.circleValue}>{item.value}</Text>
                <Text style={styles.unitText}>{item.unit}</Text>
                <Ionicons name={item.icon} size={20} color="#16F08B" style={styles.iconInside} />
              </View>
            </CircularProgressBase>
          </View>
        ))}
      </View>

      <View style={styles.rowContainer}>
        {secondRow.map((item, index) => (
          <View key={index} style={styles.growDataItem}>
            <Text style={styles.growDataTitle}>{item.name}</Text>
            <CircularProgressBase
              value={(item.percentage || 0) * 100} // Convert to 0-100%
              radius={40}
              duration={1000}
              
              activeStrokeColor="#16F08B"
              inActiveStrokeColor="#01694D"
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={5}
              inActiveStrokeWidth={5}
            >
              <View style={styles.iconOverlay}>
                <Text style={styles.circleValue}>{item.value}</Text>
                <Text style={styles.unitText}>{item.unit}</Text>
                <Ionicons name={item.icon} size={20} color="#16F08B" style={styles.iconInside} />
              </View>
            </CircularProgressBase>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  growDataSection: {
    backgroundColor: '#01694D',
    padding: 15,
    borderRadius: 20,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  growDataMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '100%',
    marginBottom: 15,
  },
  growDataItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, 
  },
  growDataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16F08B',
    marginBottom: 5,
  },
   
  iconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  unitText: {
    fontSize: 12,
    color: 'white',
  },
  iconInside: {
    marginTop: 5,
  },
});

export default GrowData;


