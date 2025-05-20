import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Axios } from "../AxiosRequestBuilder";

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

const DisplayDetail: React.FC = () => {
  const params = useLocalSearchParams();
  const [device, setDevice] = useState<Device>({
    id: "",
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

  const handleSave = async () => {
    try {
      const response = await Axios.put(`/device/update/${device.id}`, device);
      setDevice(response.data);
      console.log("Device updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating device:", error);
    }
    setIsEditing(false);
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
  }, [params.device]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <Header viewZone={false} selectedZone={""} setSelectedZone={() => {}} />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.saveButton}>Add</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Device Details</Text>
          {isEditing ? (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Ionicons
                name="create-outline"
                size={24}
                color="white"
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

        {/* {device.mac.includes("efid65b12") && (
          <View style={styles.verseContainer}>
            <Text style={styles.verseText}>
              He who keeps you will not slumber
            </Text>
            <Text style={styles.verseReference}>Psalms 121:3</Text>
          </View>
        )} */}
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
  },
  verseContainer: {
    backgroundColor: "#e8f4f8",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  verseText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 5,
    color: "#333",
  },
  verseReference: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
});

export default DisplayDetail;
