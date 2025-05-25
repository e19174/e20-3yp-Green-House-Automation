import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Axios } from "../../AxiosRequestBuilder";
import { themeAuth } from "../../../Contexts/ThemeContext";

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

const DisplayDetail: React.FC = () => {
  const {theme} = themeAuth();
  const params = useLocalSearchParams();
  const [device, setDevice] = useState<Device>({
    id: 0,
    mac: "",
    name: "",
    zoneName: "",
    location: "",
    addedAt: "",
    user: {
      name: "",
      email: "",
      phoneNumber: 0,
      imageData: "",
      imageType: "",
      imageName: "",
    },
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }

  const handleSave = async () => {
    try {
      const response = await Axios.put(`/device/update/${device.id}`, {
        name: device.name.trim(),
        zoneName: device.zoneName.trim(),
        location: device.location.trim(),
      });
      setDevice(response.data);
    } catch (error) {
      console.error("Error updating device:", error);
    }
    setIsEditing(false);
  };

  const handleAddDevice = async () => {
    try {
      const response = await Axios.put(`/device/activate/${device.id}`);
      console.log("Device added successfully:", response.data);
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  useEffect(() => {
    if (params.device) {
      try {
        const deviceObject = JSON.parse(params.device as string);
        setDevice(deviceObject);
      } catch (error) {
        console.error("Error parsing device data:", error);
      }
    }
  }, [params.device, refreshing]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Header/>
      <ScrollView contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleAddDevice}>
            <Text style={[styles.saveButton, {color: theme.colors.text}]}>Add</Text>
          </TouchableOpacity>

          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Device Details</Text>
          {isEditing ? (
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveButton, {color: theme.colors.text}]}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Ionicons
                name="create-outline"
                size={24}
                color={theme.colors.text}
                fontSize="bold"
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAC INFO</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>ID</Text>
            <Text style={styles.fieldValue}>{device.id}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>MAC Address</Text>
            <Text style={styles.fieldValue}>{device.mac}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Added At</Text>
            <Text style={styles.fieldValue}>{formatDate(device.addedAt)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Information</Text>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={device.name}
                onChangeText={(text) => setDevice({ ...device, name: text })}
                placeholder="Enter device name"
              />
            ) : (
              <Text style={styles.fieldValue}>{device.name}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Zone Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={device.zoneName}
                onChangeText={(text) =>
                  setDevice({ ...device, zoneName: text })
                }
                placeholder="Enter zone name"
              />
            ) : (
              <Text style={styles.fieldValue}>{device.zoneName}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Location</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={device.location}
                onChangeText={(text) =>
                  setDevice({ ...device, location: text })
                }
                placeholder="Enter location description"
              />
            ) : (
              <Text style={styles.fieldValue}>{device.location}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Assigned User</Text>
            <Text style={styles.fieldValue}>{device.user.name}</Text>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(4,38,28)",
  },
  scrollContainer: {
    marginBottom: 60,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: "15%",
  },
  headerTitle: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 10,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  field: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "bold",
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  }
});

export default DisplayDetail;
