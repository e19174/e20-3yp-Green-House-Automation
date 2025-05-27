import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { themeAuth } from '../../../Contexts/ThemeContext';
import About from './About';
import DeviceRegistration from './DeviceRegistration';
import DeviceManagement from './DeviceManagement';

const Manual = () => {
    const {theme} = themeAuth();
    const [filter, setFilter] = useState<string>("about");

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <Text style={styles.heading}>Manual</Text>

            <View style={styles.navigationContainer}>
                <TouchableOpacity style={styles.navigationButton} onPress={() => setFilter("about")}>
                    <Text style={[ styles.naviagte, {color: filter !== "about" ? "#bbb": theme.colors.text }]}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationButton} onPress={() => setFilter("device registration")}>
                    <Text style={[ styles.naviagte, {color: filter !== "device registration" ? "#bbb": theme.colors.text }]}>Device Registration</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationButton} onPress={() => setFilter("device management")}>
                    <Text style={[ styles.naviagte, {color: filter !== "device management" ? "#bbb": theme.colors.text }]}>Device Management</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.divider, {backgroundColor: theme.colors.text}]}></View>

            {filter === "about" && (
                <About/>
            )}

            {filter === "device registration" && (
                <DeviceRegistration/>
            )}

            {filter === "device management" && (
                <DeviceManagement/>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    heading: {
        marginVertical: 10,
        fontSize: 28,
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    navigationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    navigationButton: {
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    divider: {
        width: "95%",
        height: 1,
        backgroundColor: "#FFFFFF",
        alignSelf: "center",
    },
    naviagte: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Manual