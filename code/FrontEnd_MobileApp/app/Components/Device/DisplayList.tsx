import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Axios } from '../../AxiosRequestBuilder';
import { themeAuth } from '../../../Contexts/ThemeContext';

type Device = {
  id: number;
  mac: string;
  name: string;
  zoneName: string;
  location: string;
  addedAt: string;
  user: User;
  plant: Plant;
  active: boolean;
};

type Plant = {
  id: number;
  name: string;
  description: string;
  temperature: number;
  moisture: number;
  humidity: number;
  phosphorus: number;
  nitrogen: number;
  potassium: number;
  imageData?: string;
  imageType?: string;
  imageName?: string;
};

interface User {
  name: string;
  email: string;
  phoneNumber: number;
  imageData: string;
  imageType: string;
  imageName: string;
  authMethod: string;
}

const DeviceListScreen: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const {theme} = themeAuth();
  const [filter, setFilter] = useState<string>("active");

  const onRefresh = () => {
    setRefreshing(true);

    // Simulate fetching new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const directToDetail = (item: Device) => {
    router.push({ pathname: 'Components/Device/DisplayDetail', params: { device: JSON.stringify(item) } })
  };

  useEffect(()=>{
    const fetchDevices = async () => {
      try {
        // const response = filter === "active" ?await Axios.get('device/active') : await Axios.get('/device/by-user')
        const response = await Axios.get(filter === "active" ? '/device/active': '/device/nonActive')
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    }
    fetchDevices();
  },[refreshing, filter]);

  
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
    device.zoneName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Device }) => (
    devices.length > 0 ? (
      <TouchableOpacity onPress={() => directToDetail(item)}>
        <View style={[styles.card, {backgroundColor: theme.colors.cardBackground}]}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceDetails}>MAC: {item.mac}</Text>
          <Text style={styles.deviceDetails}>Zone: {item.zoneName}</Text>
          <Text style={styles.deviceDetails}>Location: {item.location}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>Added At: {new Date(item.addedAt).toLocaleString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
      ) :
      <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>No devices found</Text>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>

        <View style={styles.filterContainer}>
          <Pressable onPress={() => setFilter("active")}>
            <Text style={[styles.filter, {color: filter === "non-active" ? "#bbb": theme.colors.text}]}>Active</Text>
          </Pressable>
          <Pressable onPress={() => {setFilter("non-active")}}>
            <Text style={[styles.filter, {color: filter === "active" ? "#bbb": theme.colors.text}]}>Non-active</Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search devices..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          />
        <FlatList
          data={filteredDevices}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: 60 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }/>
           
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'rgb(4,38,28)',
    paddingTop: 10, 
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
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#01694D',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    marginHorizontal: 20, 
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
  timeContainer: {
    width: '100%',
  }, 
  time: {
    fontSize: 12,
    color: 'rgb(200, 200, 200)',
    textAlign: 'right',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  filter: {
    fontSize: 20,
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
});

export default DeviceListScreen;
