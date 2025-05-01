import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Header from "../common/Header";
import Footer from "../common/Footer";

// Define DataType interface
type DataType = {
  id: number;
  humidity: number;
  soilMoisture: number;
  temp: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
  updatedAt: string;
};

// Define data types for the chart
const dataTypes = [
  { key: "temp", name: "Temperature" },
  { key: "humidity", name: "Humidity" },
  { key: "soilMoisture", name: "Soil Moisture" },
  { key: "nitrogenLevel", name: "Nitrogen Level" },
  { key: "phosphorusLevel", name: "Phosphorus Level" },
  { key: "potassiumLevel", name: "Potassium Level" },
];

const StatisticsDisplay: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ avg: 0, min: 0, max: 0, trend: 0 });

  // Mock Data
  const [datas, setDatas] = useState<DataType[]>([
    {
      id: 1,
      humidity: 49.61,
      soilMoisture: 49.04,
      temp: 29.94,
      nitrogenLevel: 8.95,
      phosphorusLevel: 6.53,
      potassiumLevel: 1.43,
      updatedAt: "2/9/2025",
    },
    {
      id: 2,
      humidity: 91.88,
      soilMoisture: 11.33,
      temp: 21.64,
      nitrogenLevel: 7.86,
      phosphorusLevel: 4.54,
      potassiumLevel: 6.42,
      updatedAt: "2/12/2025",
    },
    {
      id: 3,
      humidity: 70.26,
      soilMoisture: 91.62,
      temp: 26.08,
      nitrogenLevel: 7.78,
      phosphorusLevel: 4.52,
      potassiumLevel: 8.49,
      updatedAt: "2/27/2025",
    },
    {
      id: 4,
      humidity: 46.37,
      soilMoisture: 53.24,
      temp: 21.24,
      nitrogenLevel: 9.68,
      phosphorusLevel: 7.53,
      potassiumLevel: 5.04,
      updatedAt: "2/19/2025",
    },
    {
      id: 5,
      humidity: 45.8,
      soilMoisture: 16.18,
      temp: 23.25,
      nitrogenLevel: 1.4,
      phosphorusLevel: 7.66,
      potassiumLevel: 2.26,
      updatedAt: "2/22/2025",
    },
    {
      id: 6,
      humidity: 83.86,
      soilMoisture: 86.51,
      temp: 24.82,
      nitrogenLevel: 3.62,
      phosphorusLevel: 2.16,
      potassiumLevel: 1.95,
      updatedAt: "2/16/2025",
    },
    {
      id: 7,
      humidity: 21.36,
      soilMoisture: 86.59,
      temp: 26.91,
      nitrogenLevel: 8.3,
      phosphorusLevel: 1.75,
      potassiumLevel: 2.86,
      updatedAt: "2/5/2025",
    },
    {
      id: 8,
      humidity: 32.55,
      soilMoisture: 30.59,
      temp: 23.68,
      nitrogenLevel: 7.65,
      phosphorusLevel: 9.21,
      potassiumLevel: 3.17,
      updatedAt: "2/23/2025",
    },
    {
      id: 9,
      humidity: 70.85,
      soilMoisture: 93.75,
      temp: 29.14,
      nitrogenLevel: 8.02,
      phosphorusLevel: 6.63,
      potassiumLevel: 8.76,
      updatedAt: "2/17/2025",
    },
    {
      id: 10,
      humidity: 28.99,
      soilMoisture: 48.96,
      temp: 28.98,
      nitrogenLevel: 4.05,
      phosphorusLevel: 8.9,
      potassiumLevel: 3.85,
      updatedAt: "2/5/2025",
    },
    {
      id: 11,
      humidity: 54.62,
      soilMoisture: 33.62,
      temp: 28.25,
      nitrogenLevel: 1.84,
      phosphorusLevel: 2.35,
      potassiumLevel: 4.52,
      updatedAt: "2/19/2025",
    },
    {
      id: 12,
      humidity: 22.78,
      soilMoisture: 60.59,
      temp: 22.15,
      nitrogenLevel: 4.4,
      phosphorusLevel: 3.21,
      potassiumLevel: 4.17,
      updatedAt: "2/15/2025",
    },
    {
      id: 13,
      humidity: 41.94,
      soilMoisture: 57.47,
      temp: 22.34,
      nitrogenLevel: 1.88,
      phosphorusLevel: 6.86,
      potassiumLevel: 4.1,
      updatedAt: "2/22/2025",
    },
    {
      id: 14,
      humidity: 22.3,
      soilMoisture: 77.05,
      temp: 23.78,
      nitrogenLevel: 6.9,
      phosphorusLevel: 6.93,
      potassiumLevel: 2.31,
      updatedAt: "2/22/2025",
    },
    {
      id: 15,
      humidity: 86.53,
      soilMoisture: 74.15,
      temp: 25.19,
      nitrogenLevel: 5.0,
      phosphorusLevel: 5.81,
      potassiumLevel: 1.56,
      updatedAt: "2/28/2025",
    },
    {
      id: 16,
      humidity: 83.3,
      soilMoisture: 52.74,
      temp: 25.85,
      nitrogenLevel: 5.5,
      phosphorusLevel: 2.84,
      potassiumLevel: 1.75,
      updatedAt: "2/3/2025",
    },
    {
      id: 17,
      humidity: 28.66,
      soilMoisture: 81.59,
      temp: 26.26,
      nitrogenLevel: 4.98,
      phosphorusLevel: 5.46,
      potassiumLevel: 2.2,
      updatedAt: "2/23/2025",
    },
    {
      id: 18,
      humidity: 47.29,
      soilMoisture: 93.52,
      temp: 28.87,
      nitrogenLevel: 3.61,
      phosphorusLevel: 1.65,
      potassiumLevel: 2.01,
      updatedAt: "2/14/2025",
    },
    {
      id: 19,
      humidity: 48.6,
      soilMoisture: 56.55,
      temp: 29.79,
      nitrogenLevel: 6.96,
      phosphorusLevel: 4.18,
      potassiumLevel: 9.15,
      updatedAt: "2/15/2025",
    },
    {
      id: 20,
      humidity: 38.7,
      soilMoisture: 45.78,
      temp: 22.84,
      nitrogenLevel: 4.22,
      phosphorusLevel: 5.0,
      potassiumLevel: 7.85,
      updatedAt: "2/25/2025",
    },
    {
      id: 21,
      humidity: 46.58,
      soilMoisture: 99.5,
      temp: 28.38,
      nitrogenLevel: 6.32,
      phosphorusLevel: 6.08,
      potassiumLevel: 6.94,
      updatedAt: "2/11/2025",
    },
    {
      id: 22,
      humidity: 82.43,
      soilMoisture: 85.25,
      temp: 28.02,
      nitrogenLevel: 8.27,
      phosphorusLevel: 5.06,
      potassiumLevel: 2.31,
      updatedAt: "2/4/2025",
    },
    {
      id: 23,
      humidity: 79.48,
      soilMoisture: 71.99,
      temp: 21.94,
      nitrogenLevel: 6.1,
      phosphorusLevel: 6.37,
      potassiumLevel: 2.38,
      updatedAt: "2/3/2025",
    },
    {
      id: 24,
      humidity: 84.87,
      soilMoisture: 49.77,
      temp: 25.85,
      nitrogenLevel: 7.03,
      phosphorusLevel: 5.1,
      potassiumLevel: 4.97,
      updatedAt: "2/15/2025",
    },
    {
      id: 25,
      humidity: 29.34,
      soilMoisture: 58.95,
      temp: 25.77,
      nitrogenLevel: 3.52,
      phosphorusLevel: 6.76,
      potassiumLevel: 7.13,
      updatedAt: "2/22/2025",
    },
    ]);

  useEffect(() => {
    analyzeData(datas, dataTypes[currentIndex].key as keyof DataType);
  }, [currentIndex, datas]);

  const analyzeData = (data: DataType[], type: keyof DataType) => {
    if (data.length === 0) return;

    const values = data.map((item) => item[type] as number);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const trend = values[values.length - 1] - values[0];
    setStats({ avg, min, max, trend });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % dataTypes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + dataTypes.length) % dataTypes.length);
  };


  return (
    <View style={styles.container}>
    <Header viewZone={false} selectedZone={""} setSelectedZone={() => {}} />

    <ScrollView contentContainerStyle={styles.editProfile}>
      <Text style={styles.title}>Live Data Statistics</Text>

      {/* Switch Data Type Buttons */}
      <View style={styles.switchContainer}>
        <TouchableOpacity onPress={handlePrev} style={styles.arrowButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.currentDataTypeText}>
          {dataTypes[currentIndex].name}
        </Text>

        <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Statistical Summary */}
      <View style={styles.summary}>
        <Text style={styles.label}>📊 Average: {stats.avg.toFixed(2)}</Text>
        <Text style={styles.label}>🔺 Max: {stats.max}</Text>
        <Text style={styles.label}>🔻 Min: {stats.min}</Text>
        <Text style={styles.label}>
          📈 Trend: {stats.trend > 0 ? "Increasing" : "Decreasing"}
        </Text>
      </View>

      {/* Line Chart */}
      <LineChart
        data={{
          labels: datas.map((_, i) => (i + 1).toString()), // X-axis labels
          datasets: [
            {
              data: datas.map(
                (item) => item[dataTypes[currentIndex].key as keyof DataType] as number || 0
              ),
            },
          ],
        }}
        width={400} 
        height={300}
        chartConfig={chartConfig()}
        style={styles.chart}
        />
    </ScrollView>
    <Footer/>
  </View>
  );
};

// Chart configuration
const chartConfig = () => ({
  backgroundGradientFrom: "rgb(1, 105, 77)",
  backgroundGradientTo: "rgb(1, 105, 77)",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: () => "#fff",
});

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#012A1C", 
    alignItems: "center",
    width: "100%",
  },
  editProfile: {
    flexGrow: 2,
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  title: {
    marginTop: "13%",
    marginBottom: 20,
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  chart: {
    marginTop:20,
    marginBottom: 20,
    marginVertical: 20,
    marginHorizontal: 50,
    borderRadius: 8,
    width: "80%",
    height: "auto",
  },
  label: {
    fontSize: 20,
    color: "#D1D5DB",
    fontWeight: "600",
    marginVertical: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    width: "80%",
  },
  arrowButton: {
    padding: 12,
    backgroundColor: "rgb(1, 105, 77)",
    borderRadius: 10,
  },
  currentDataTypeText: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
  },
  summary:{
    padding: 20,
    backgroundColor: "rgb(1, 105, 77)",
    borderRadius: 8,
    width: "80%",
    marginVertical: 10,
    textAlign: "center",
    // shadowColor: "#004",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    elevation: 5,
  }
});

export default StatisticsDisplay;