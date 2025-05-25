import React from 'react';
import { View, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { themeAuth } from '../../../Contexts/ThemeContext';

const Footer: React.FC = () => {
  const {theme} = themeAuth();
  return (
    <View style={[styles.footer, {backgroundColor: theme.colors.primary}]}>
      <TouchableOpacity onPress={() => router.push("Components/Home/Home")}>
        <Ionicons name="home" size={28} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("Components/Device/DisplayList")}>
        <Ionicons name="radio-sharp" size={28} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("Components/Statics/Statistics")}>
        <Ionicons name="bar-chart" size={28} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#01694D',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Footer;
