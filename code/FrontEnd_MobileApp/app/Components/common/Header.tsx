import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface HeaderProps {
  selectedZone: string;
  viewZone: boolean;
  setSelectedZone: (zone: string) => void;
}

interface USER {
  name: String,
  email: String,
  phoneNumber: number,
  imageData: string;
  imageType: String,
  imageName: String,
}

const Header: React.FC<HeaderProps> = ({ selectedZone, setSelectedZone, viewZone }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const zones: string[] = ['ZONE 1', 'ZONE 2'];

  const[user, setUser] = useState<USER>()
  
  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = axios.get("http://localhost:8080/api/v1/auth/user/getUser", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser((await response).data);
      console.log((await response).data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(!AsyncStorage.getItem("token")){
      router.push('Components/Authentication/login');
    }
    fetchUserData();
  },[])

  const handleLogout = () => {
    AsyncStorage.removeItem("token");
    router.push('Components/Authentication/login');
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="notifications" size={26} color="white" />
        </TouchableOpacity>

        {viewZone &&
          <View style={styles.zoneSelector}>
            <Text style={styles.zoneText}>{selectedZone}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        }

        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={zones}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedZone(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={sidebarVisible} transparent animationType="slide" onRequestClose={() => setSidebarVisible(false)}>
        <SafeAreaView >
        <View style={styles.sidebarContainer}>
          <View style={styles.sidebarContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSidebarVisible(false)}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            <Image
              source={user?.imageData? `data:${user.imageType};base64,${user.imageData}`: require("../../../assets/profile_picture.webp")}
              style={styles.profilePicture}
            />

            <View style={styles.divider} />

            <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push('Components/Profile/Profile')}>
              <Ionicons name="person" size={24} color="white" />
              <Text style={styles.sidebarText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push('Components/Settings')}>
              <Ionicons name="settings" size={24} color="white" />
              <Text style={styles.sidebarText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push('Components/Device/DisplayList')}>
              <Ionicons name="radio-sharp" size={24} color="white" />
              <Text style={styles.sidebarText}>Instruments</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem} onPress={() => router.push('Components/Manual/Manual')}>
              <Ionicons name="radio-sharp" size={24} color="white" />
              <Text style={styles.sidebarText}>Manual</Text>
            </TouchableOpacity>


            <View style={styles.divider} />
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>App Version 10.2.1</Text>
          </View>
        </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#01694D',
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  zoneSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
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
  sidebarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  sidebarContent: {
    width: '70%',
    backgroundColor: '#014D38',
    padding: 25,
    // shadowColor: '#000',
    // shadowOffset: { width: 2, height: 0 },
    // shadowOpacity: 0.25,
    // shadowRadius: 10,
    elevation: 10,
    height: '100%',
  },
  closeButton: {
    padding: 10,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
    alignSelf: 'center',
    marginVertical: 20,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sidebarText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 15,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  logoutText: {
    fontSize: 24,
    padding: 'auto',
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutButton:{
    paddingTop:'auto',
    marginTop: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
  }
});

export default Header;