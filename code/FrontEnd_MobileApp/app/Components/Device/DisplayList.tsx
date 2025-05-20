import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Header from '../common/Header';  
import Footer from '../common/Footer'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Axios } from '../AxiosRequestBuilder';

type Device = {
  id: string;
  mac: string;
  name: string;
  zoneName: string;
  location: string;
  addedAt: string;
  user: User;
};

interface User {
  name: string;
  email: string;
  phoneNumber: number;
  imageData: string;
  imageType: string;
  imageName: string;
}

const DeviceListScreen: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const directToDetail = (item: Device) => {
    router.push({ pathname: 'Components/Device/DisplayDetail', params: { device: JSON.stringify(item) } })
  };

  useEffect(()=>{
    const token = AsyncStorage.getItem('token');
    const fetchDevices = async () => {
      try {
        const response = await Axios.get('/device/getAll');
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    }
    fetchDevices();
  },[])

  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDevices(prevDevices =>
        prevDevices.map(device => ({
          ...device,
          lastUpdated: new Date().toISOString(),
        }))
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const filteredDevices = devices.filter(device =>
    device.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.mac?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.zoneName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Device }) => (
    <TouchableOpacity onPress={() => directToDetail(item)}>
      <View style={styles.card}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceDetails}>MAC: {item.mac}</Text>
        <Text style={styles.deviceDetails}>Zone: {item.zoneName}</Text>
        <Text style={styles.deviceDetails}>Location: {item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header viewZone={false} selectedZone={''} setSelectedZone={() => {}} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search devices..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          />
        <FlatList
          data={filteredDevices}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          />
           
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: "25%",
    backgroundColor: 'rgb(4,38,28)' 
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 32,
    backgroundColor: '#fff',
    color: '#000',
    width: '90%',
    alignSelf: 'center',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#01694D',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    marginHorizontal: 10, 
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#fff',
  },
  deviceDetails: {
    fontSize: 14,
    color: '#eee',
    marginBottom: 4,
  },
});

export default DeviceListScreen;
