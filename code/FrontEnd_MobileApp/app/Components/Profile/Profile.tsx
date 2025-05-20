import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useAuth } from "../../Contexts/UserContext";

interface USER {
  name: string;
  email: string;
  phoneNumber: number;
  imageData: string;
  imageType: string;
  imageName: string;
}

// Main Profile Component
const Profile: React.FC = () => {
  const {user, setUser} = useAuth();
  
  const imageUri = `data:${user?.imageType};base64,${(user?.imageData)}`;

  return (
    <View style={styles.container}>
      <Header viewZone={false} selectedZone={""} setSelectedZone={() => {}} />

      <View style={styles.profileContainer}>
        <Text style={styles.headings}> Profile </Text>
          <View style={styles.profileWork}>
            <View style={styles.inner}>
              <Image
                source={user?.imageData ? { uri: imageUri } : require("../../../assets/profile_picture.webp")}
                style={styles.profileImage}
                />
            </View>
          </View>
        
          <TouchableOpacity style={styles.editProfileButton} onPress={() => router.push({ pathname: 'Components/Profile/EditProfile', params: {user: JSON.stringify(user)} })}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailsContent}>
          <View style={styles.detailsRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{user?.name }</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{ user?.email}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.label}>Contact No</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{user?.phoneNumber }</Text>
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
  headings : {
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
    backgroundColor: "#fff",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1, 
    width: "70%",
  },
});

export default Profile;
