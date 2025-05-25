import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import Header from '../common/Header';  
import Footer from '../common/Footer';  
import GrowComponents from './GrowComponents';
import GrowData from './GrowData';
import { themeAuth } from '../../Contexts/ThemeContext';
import { useLocalSearchParams } from 'expo-router';

type Device = {
  id: number;
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

const Zone: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const params = useLocalSearchParams();
  const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(JSON.parse(params.zone as string)[0]);
  const [isEnabled, setIsEnabled] = useState<boolean[]>([false, false, false, false]);
  const { theme } = themeAuth();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }

  useEffect(() => {
      if (params.zone) {
        try {
          const deviceObject = JSON.parse(params.zone as string);
          setDevices(deviceObject);
        } catch (error) {
          console.error("Error parsing device data:", error);
        }
      }
    }, [params.zone, refreshing]);

  const toggleStatus = (index: number) => {
    setIsEnabled((prevState) => {
      const newStates = [...prevState]; 
      newStates[index] = !newStates[index]; 
      return newStates;
    });
  };

  return (
    <>
    <Header/>

    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={
        <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        />
      }>
      
      <View style={styles.zoneSelector}>
          <Text style={[styles.zoneText, {color: theme.colors.text}]}>{selectedDevice?.name}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={[styles.dropdownArrow, {color: theme.colors.text}]}>▼</Text>
          </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={devices}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedDevice(item);
                  setModalVisible(false);
                }}
                >
                  <Text style={styles.modalText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              />
          </View>
        </View>
      </Modal>

      <View style={styles.content}>
        

        <GrowComponents isEnabled={isEnabled} toggleStatus={toggleStatus} />
        <GrowData deviceId={selectedDevice?.id} />
      </View>

    </ScrollView>

    <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04261C',
    alignItems: 'center', 
    paddingTop: 70, 
  },
  content: {
  },
  zoneSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  zoneText: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 25,
    color: '#16F08B',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#01694D',
    width: '50%',
    padding: 10,
    borderRadius: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalText: {
    fontSize: 15,
    color: "#F6FCDF",
    textAlign: 'center',
  },
});

export default Zone;

