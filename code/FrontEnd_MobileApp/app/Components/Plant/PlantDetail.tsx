// PlantDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

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

const PlantDetail = () => {
    const [plant, setPlant] = React.useState<Plant>({
        name: '',
        description: '',
        temperature: 0,
        humidity: 0,
        moisture: 0,
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        imageData: '',
        imageType: '',
        imageName: ''
    });
    const params = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
    if (params.plant) {
        try {
        const plantObject = JSON.parse(params.plant as string);
        setPlant(plantObject);
        } catch (error) {
        console.error("Error parsing plant data:", error);
        }
    }
    }, [params.plant, refreshing]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
        setRefreshing(false);
        }, 1500);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}
                refreshControl={
                <RefreshControl refreshing={false} onRefresh={onRefresh} />
                }
            >
            <Text style={styles.title}>{plant.name}</Text>
            <Image
                source={{ uri: `data:${plant.imageType};base64,${plant.imageData}` }}
                style={styles.image}
            />
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{plant.description}</Text>

            <Text style={styles.label}>Temperature:</Text>
            <Text style={styles.value}>{plant.temperature}°C</Text>

            <Text style={styles.label}>Humidity:</Text>
            <Text style={styles.value}>{plant.humidity}%</Text>

            <Text style={styles.label}>Moisture:</Text>
            <Text style={styles.value}>{plant.moisture}%</Text>

            <Text style={styles.label}>Nitrogen:</Text>
            <Text style={styles.value}>{plant.nitrogen} mg/kg</Text>

            <Text style={styles.label}>Phosphorus:</Text>
            <Text style={styles.value}>{plant.phosphorus} mg/kg</Text>

            <Text style={styles.label}>Potassium:</Text>
            <Text style={styles.value}>{plant.potassium} mg/kg</Text>
        </ScrollView>
    );
    };

const styles = StyleSheet.create({
container: {
    backgroundColor: '#012A1C',
    flex: 1,
    padding: 20,
    marginTop: 20,
    borderRadius: 12,
},
title: {
    fontSize: 26,
    color: '#ccc',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
},
image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
},
label: {
    color: '#01694D',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
},
value: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 5,
},
});

export default PlantDetail;
