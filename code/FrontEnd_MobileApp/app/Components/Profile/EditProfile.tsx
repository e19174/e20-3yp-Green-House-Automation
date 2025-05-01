import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import Footer from "../common/Footer";
import Header from "../common/Header";

interface USER {
  name: string,
  email: string,
  phoneNumber: number,
  imageData: Uint8Array;
  imageType: string,
  imageName: string,
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<USER>({
    name: '',
    email: '',
    phoneNumber: 0,
    imageData: '',
    imageType: '',
    imageName: '',
  });
  const params = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<any>();
  const [image, setImage] = useState<FileToUpload>();

  const handlePickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 1 },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error:", response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            const file = response.assets[0]; // Extract file info
            setImageUri(file.uri);
            setImage({
              uri: file.uri || "",
              name: file.fileName || "upload.jpg",
              type: file.type || "image/jpeg",
            })
            // setImageUri(file.uri);
            // const fileToUpload: FileToUpload = {
            //   uri: file.uri || "",
            //   name: file.fileName || "profile.jpg",
            //   type: file.type || "image/jpeg",
            // };
            // handleUpdate(fileToUpload);
          }
        }
      }
    );
  };


  useEffect(() => {
    if (params.user) {
      try {
        const userData: USER = JSON.parse(params.user as string);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [params.user]); // Fix: Add `params.user` as a dependency
    
  const handleInput = (text: string|number, field: keyof USER) => {
    setUser((prevUser) => ({
      ...prevUser!,
      [field]: text,  // Correct way to dynamically update state
    }));
  };

  interface FileToUpload {
    uri: string;
    name: string;
    type: string;
  }

  const handleUpdate = async () => {
    const formData = new FormData();
    if (image) {
      formData.append("file", {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any);
    }
    formData.append("name", user.name);
    formData.append("phoneNumber", user.phoneNumber.toString());
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/user/update", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setUser(response.data);
      console.log(user);
      console.log(formData.get("file"));
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(()=>{
  //   setImageUrl(`data:${user?.imageType};base64,${(user?.imageData)}`);
  // },[user])

  // State for user input
  return (
    <View style={styles.container}>
      <Header viewZone={false} selectedZone={""} setSelectedZone={() => {}} />

      <View style={styles.profileContainer}>
        <Text style={styles.headings}> Edit Profile </Text>
          <View style={styles.profileWork}>
            <View style={styles.inner}>
              <Image
                source={user?.imageData ? { uri: imageUri } : require("../../../assets/profile_picture.jpg")}
                style={styles.profileImage}
              />
              <Button title='add' onPress={handlePickImage}/>
            </View>
          </View>
        
        <TouchableOpacity style={styles.editProfileButton} onPress={() => handleUpdate()}>
          <Text style={styles.editProfileText}>Update</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.detailsRow}>
          <Text style={styles.label}>Name</Text>
            <Text style={styles.separator}>:</Text>
             <TextInput 
                style={styles.value} 
                value={user?.name || ''} 
                onChangeText={(text) => handleInput(text, "name")} // ✅ Pass text and field name
                placeholderTextColor="white"
             />
            </View>


        <View style={styles.detailsRow}>
          <Text style={styles.label}>Email</Text>
            <Text style={styles.separator}>:</Text>
               <TextInput 
                style={styles.value} 
                value={user?.email} 
                onChangeText={(text) => handleInput(text, "email")} // ✅ Pass text and field name
                placeholderTextColor="white"
             />
            </View>

        <View style={styles.detailsRow}>
          <Text style={styles.label}>Contact-No</Text>
            <Text style={styles.separator}>:</Text>
              <TextInput
                style={styles.value} 
                 value={user?.phoneNumber?.toString() || ''} 
                 onChangeText={(text) => handleInput(Number(text), "phoneNumber")} // ✅ Pass text and field name
                 placeholderTextColor="white"
                />
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
