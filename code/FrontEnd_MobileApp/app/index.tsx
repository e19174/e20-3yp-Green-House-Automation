import { router, useFocusEffect } from "expo-router";
import React from "react";
import {StyleSheet, Text, View, Image, Alert } from "react-native";
import { get, remove } from "../Storage/secureStorage";
import { themeAuth } from "../Contexts/ThemeContext";
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator } from "react-native";
import { userAuth } from "../Contexts/UserContext";
import { Axios } from "./AxiosRequestBuilder";

// SplashScreen.preventAutoHideAsync();

const Page:React.FC = () => {
  const { theme } = themeAuth();
  const {user, setUser} = userAuth();


  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const checkToken = async () => {
        const token = await get("token");
        setTimeout(async () => {
          if (!token && isActive) {
            router.push("/Authentication/login");
          } else if (isActive) {
            try {
              const response = await Axios.get("/auth/user/getUser", {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              router.replace("/Components/Home/Home");
              setUser(response.data);
            } catch (error: any) {
                remove("token")
                router.push("/Authentication/login");
            }
          }
          // await SplashScreen.hideAsync();
        }, 2000);
      };
      checkToken();
      return () => { isActive = false; };
    }, [])
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Image source={theme.dark ? require('../assets/logopng_dark.png') : require('../assets/logopng_light.png')} style={styles.logo} />
      <Text style={[styles.title, {color: theme.dark? "#fff" : "#01694D"}]}>Green Tech</Text>
      {/* <ActivityIndicator size="large" color={theme.dark ? "#fff" : "#01694D"} style={{marginTop: 20}} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: 'rgb(4, 38, 28)',
    marginTop: -30,
  },
  title: {
    fontSize: 58,
    fontWeight: "bold",
    color: '#fff',
  },
  logo:{
    height: 100,
    objectFit: 'contain',
    marginBottom: 20,
  }
});

export default Page;