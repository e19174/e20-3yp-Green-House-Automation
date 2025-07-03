import { View, Text, Modal, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Axios } from '../../AxiosRequestBuilder'
import { Ionicons } from "@expo/vector-icons";

interface Plant {
  id: number;
  name: string;
  description: string;
  temperature: number;
  moisture: number;
  humidity: number;
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
  const [plants, setPlants] = useState<Plant[]>([
    {
      id: 1,
      name: "plant1",
      description: "Description 1",
      temperature: 0,
      moisture: 0,
      humidity: 0,
      phosphorus: 0,
      nitrogen: 0,
      potassium: 0,
      imageData: "",
      imageType: "",
      imageName: "",
    },
    {
      id: 2,
      name: "plant2",
      description: "Description 2",
      temperature: 0,
      moisture: 0,
      humidity: 0,
      phosphorus: 0,
      nitrogen: 0,
      potassium: 0,
      imageData: "",
      imageType: "",
      imageName: "",
    },
    {
      id: 3,
      name: "plant3",
      description: "Description 3",
      temperature: 0,
      moisture: 0,
      humidity: 0,
      phosphorus: 0,
      nitrogen: 0,
      potassium: 0,
      imageData: "",
      imageType: "",
      imageName: "",
    },
    {
      id: 4,
      name: "plant4",
      description: "Description 4",
      temperature: 0,
      moisture: 0,
      humidity: 0,
      phosphorus: 0,
      nitrogen: 0,
      potassium: 0,
      imageData: "",
      imageType: "",
      imageName: "",
    },
    {
      id: 5,
      name: "plant5",
      description: "Description 5",
      temperature: 0,
      moisture: 0,
      humidity: 0,
      phosphorus: 0,
      nitrogen: 0,
      potassium: 0,
      imageData: "",
      imageType: "",
      imageName: "",
    },
  ]);
  
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await Axios.get("/");
        setPlants(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  },[]);

  const handlePlantSelect = (plant : Plant) => {
    console.log("Selected plant:", plant);
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  plantName:{
    fontSize: 18,
    marginLeft: 20
  },
  plantImage:{
    width: 50,
    height: 50,
    borderRadius: 8
  }
})

export default SelectPlant