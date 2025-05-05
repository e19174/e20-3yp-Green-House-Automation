import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import Footer from "../common/Footer";
import Header from "../common/Header";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface USER {
  name: string;
  email: string;
  phoneNumber: number;
  imageData: string;
  imageType: string;
  imageName: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<USER>({
    name: "",
    email: "",
    phoneNumber: 0,
    imageData: "",
    imageType: "",
    imageName: "",
  });
  const params = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [image, setImage] = useState<FileToUpload>();

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 1,
      });
      if (result.didCancel) {
        console.log("User cancelled image picker");
      } else if (result.errorCode) {
        console.log("ImagePicker Error:", result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setImageUri(file.uri || null);
        setImage(file as FileToUpload);
      }
    } catch (error) {
      console.error("Image picking failed:", error);
    }
  };

  useEffect(() => {
    if (params.user) {
      try {
        const userData: USER = JSON.parse(params.user as string);
        setUser(userData);
        const imageUri = `data:${userData.imageType};base64,${userData.imageData}`;
        setImageUri(imageUri);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [params.user]);

  const handleInput = (text: string | number, field: keyof USER) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: text,
    }));
  };

  interface FileToUpload {
    uri: string;
    name: string;
    type: string;
  }

  const handleUpdate = async () => {
    console.log(image);
    const formData = new FormData();
    if (image) {
      if (image.uri) {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        formData.append("file", blob, image.name);
      }
    }
    formData.append("name", user.name);
    formData.append("phoneNumber", user.phoneNumber.toString());

    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:8080/api/v1/auth/user/update",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setUser(response.data);
      router.push("Components/Profile/Profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Header viewZone={false} selectedZone={""} setSelectedZone={() => {}} />

      <View style={styles.profileContainer}>
        <Text style={styles.headings}> Edit Profile </Text>
        <View style={styles.profileWork}>
          <View style={styles.inner}>
            <Image
              source={
                user?.imageData
                  ? { uri: imageUri }
                  : require("../../../assets/profile_picture.webp")
              }
              style={styles.profileImage}
            />
            <Button title="add" onPress={handlePickImage} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => handleUpdate()}
        >
          <Text style={styles.editProfileText}>Update</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailsContent}>
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.separator}>:</Text>
            <TextInput
              style={styles.value}
              value={user?.name || ""}
              onChangeText={(text) => handleInput(text, "name")}
              placeholderTextColor="white"
            />
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.label}>Contact-No</Text>
            <Text style={styles.separator}>:</Text>
            <TextInput
              style={styles.value}
              value={user?.phoneNumber?.toString() || ""}
              onChangeText={(text) => handleInput(text.replace(/[^0-9]/g, ""), "phoneNumber")}
              placeholderTextColor="white"
            />
          </View>
        </View>
      </View>
      <Footer />
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#012A1C",
    alignItems: "center",
  },
  headings: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  profileContainer: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "#012A1C",
    width: "100%",
    paddingTop: 50,
    paddingBottom: 50,
  },
  profileWork: {
    width: "100%",
    height: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    backgroundColor: "#01694D",
    width: "100%",
    height: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editProfileButton: {
    marginTop: 15,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#012A1C",
  },
  detailsContainer: {
    width: "90%",
    backgroundColor: "#01694D",
    padding: 20,
    marginTop: 20,
    borderRadius: 20,
  },
  detailsContent: {
    flexDirection: "column",
    paddingVertical: 10,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    width: "30%",
  },
  separator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 12,
  },
  value: {
    fontSize: 15,
    fontWeight: "light",
    color: "#FFFFFF",
    flex: 1,
    width: "70%",
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
});

export default Profile;
