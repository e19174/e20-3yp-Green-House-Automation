import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {StyleSheet, Text, View, Image, Alert } from "react-native";
import { get, remove } from "./Storage/secureStorage";

const Page:React.FC = () => {

  useEffect(() => {
    const checkToken = async () => {
      const token = await get("token");
      setTimeout(() => {
        if (!token) {
          router.push("/Components/Authentication/login");
        } else {
          router.push("/Components/Home/Home");
        }
      }, 2000);
    };
    checkToken();
  }, [])

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logopng_dark.png')} style={styles.logo}></Image>
      <Text style={styles.title}>Green Tech</Text>
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
    color: 'rgb(232, 232, 232)',
  },
  logo:{
    height: 100,
    objectFit: 'contain',
    marginBottom: 20,
  }
});

export default Page;