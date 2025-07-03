// AllPlantsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Axios } from "../../AxiosRequestBuilder";

interface Plant {
  name: string;
  description: string;
  temperature: number;
  humidity: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  imageData: string;
  imageType: string;
  imageName: string;
}

const Plant = () => {
  const [plants, setPlants] = useState<Plant[]>([
    {
      name: "Tomat",
      description: "A sun-loving plant...",
      temperature: 25,
      humidity: 60,
      moisture: 40,
      nitrogen: 15,
      phosphorus: 10,
      potassium: 20,
      imageData: "",
      imageType: "image/jpeg",
      imageName: "tomato.jpg",
    },
    {
      name: "Tomao",
      description: "A sun-loving plant...",
      temperature: 25,
      humidity: 60,
      moisture: 40,
      nitrogen: 15,
      phosphorus: 10,
      potassium: 20,
      imageData: "",
      imageType: "image/jpeg",
      imageName: "tomato.jpg",
    },
    {
      name: "Tomto",
      description: "A sun-loving plant...",
      temperature: 25,
      humidity: 60,
      moisture: 40,
      nitrogen: 15,
      phosphorus: 10,
      potassium: 20,
      imageData: "",
      imageType: "image/jpeg",
      imageName: "tomato.jpg",
    },
    {
      name: "Toato",
      description: "A sun-loving plant...",
      temperature: 25,
      humidity: 60,
      moisture: 40,
      nitrogen: 15,
      phosphorus: 10,
      potassium: 20,
      imageData: "",
      imageType: "image/jpeg",
      imageName: "tomato.jpg",
    },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await Axios.get("/plant/getAllPlants");
        setPlants(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlants();
  }, []);

  const renderItem = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "Components/Statics/PlantDetail",
          params: { plant: JSON.stringify(item) },
        })
      }
    >
      <Image
        source={
          item.imageData
            ? { uri: `data:${item.imageType};base64,${item.imageData}` }
            : require("../../../assets/noImage.jpg")
        }
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Plants</Text>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#012A1C",
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#01694D",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 30,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});

export default Plant;
