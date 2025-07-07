import { View, Text, Modal, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Axios } from '../../AxiosRequestBuilder'
import { Ionicons } from "@expo/vector-icons";

interface Plant {
  id: number;
  name: string;
  description: string;
  temperatureLow: number;
  temperatureHigh: number;
  humidityLow: number;
  humidityHigh: number;
  moistureLow: number;
  moistureHigh: number;
  phosphorus: number;
  nitrogen: number;
  potassium: number;
  imageData: string;
  imageType: string;
  imageName: string;
}

interface SelectPlantProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  setSelectedPlant: (plant: Plant) => void;
}

const SelectPlant = ({ modalVisible, setModalVisible, setSelectedPlant }: SelectPlantProps) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await Axios.get("/plant/getAll");
        setPlants(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPlants();
  },[]);

  const handlePlantSelect = (plant : Plant) => {
    setModalVisible(false);
    setSelectedPlant(plant);
  }

  return (
    <Modal visible={modalVisible} transparent style={styles.modal}>
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.heading}>Plants</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                <FlatList
                  data={plants}
                  renderItem={({item}: {item:Plant}) => (
                    <TouchableOpacity onPress={() => handlePlantSelect(item)}>
                      <View style={styles.plantView}>
                          <Image source={item.imageData ? { uri: `data:${item.imageType};base64,${item.imageData}` } :
                           require("../../../assets/noImage.jpg")} style={styles.plantImage}/>
                          <Text style={styles.plantName}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
            </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    backgroundColor: "#01694D",
    height: "70%",
    width: "85%",
    alignSelf: "center",
    marginTop: "35%",
    borderRadius: 16,
    padding: 16,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  heading: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  plantView:{
    backgroundColor: "white",
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  plantName:{
    fontSize: 18,
    marginLeft: 20
  },
  plantImage:{
    width: 80,
    height: 80,
    borderRadius: 8
  }
})

export default SelectPlant