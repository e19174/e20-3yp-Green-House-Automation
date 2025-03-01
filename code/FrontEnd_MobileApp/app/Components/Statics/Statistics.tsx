// export default StatisticsDisplay;
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

// const API_URL =
//   "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_24hr_vol=true";


const datas = [
  {
    "temperature": 67,
    "humidity": 14,
    "soilMoisture": 95,
    "nitrogenLevel": 4,
    "phosphorusLevel": 5,
    "potassiumLevel": 86,
    "createdAt": "4/9/2024"
  },
  {
    "temperature": 10,
    "humidity": 69,
    "soilMoisture": 20,
    "nitrogenLevel": 39,
    "phosphorusLevel": 74,
    "potassiumLevel": 44,
    "createdAt": "10/24/2024"
  },
  {
    "temperature": 97,
    "humidity": 54,
    "soilMoisture": 93,
    "nitrogenLevel": 7,
    "phosphorusLevel": 74,
    "potassiumLevel": 72,
    "createdAt": "5/8/2024"
  },
  {
    "temperature": 58,
    "humidity": 53,
    "soilMoisture": 15,
    "nitrogenLevel": 14,
    "phosphorusLevel": 51,
    "potassiumLevel": 46,
    "createdAt": "4/8/2024"
  },
  {
    "temperature": 45,
    "humidity": 8,
    "soilMoisture": 12,
    "nitrogenLevel": 6,
    "phosphorusLevel": 44,
    "potassiumLevel": 14,
    "createdAt": "4/5/2024"
  },
  {
    "temperature": 74,
    "humidity": 50,
    "soilMoisture": 63,
    "nitrogenLevel": 28,
    "phosphorusLevel": 96,
    "potassiumLevel": 83,
    "createdAt": "3/22/2024"
  },
  {
    "temperature": 49,
    "humidity": 30,
    "soilMoisture": 39,
    "nitrogenLevel": 53,
    "phosphorusLevel": 55,
    "potassiumLevel": 90,
    "createdAt": "9/2/2024"
  },
  {
    "temperature": 19,
    "humidity": 36,
    "soilMoisture": 26,
    "nitrogenLevel": 34,
    "phosphorusLevel": 32,
    "potassiumLevel": 30,
    "createdAt": "10/25/2024"
  },
  {
    "temperature": 54,
    "humidity": 40,
    "soilMoisture": 40,
    "nitrogenLevel": 46,
    "phosphorusLevel": 73,
    "potassiumLevel": 43,
    "createdAt": "8/28/2024"
  },
  {
    "temperature": 73,
    "humidity": 3,
    "soilMoisture": 99,
    "nitrogenLevel": 39,
    "phosphorusLevel": 19,
    "potassiumLevel": 74,
    "createdAt": "5/5/2024"
  },
  {
    "temperature": 66,
    "humidity": 2,
    "soilMoisture": 65,
    "nitrogenLevel": 8,
    "phosphorusLevel": 83,
    "potassiumLevel": 50,
    "createdAt": "10/16/2024"
  },
  {
    "temperature": 41,
    "humidity": 58,
    "soilMoisture": 3,
    "nitrogenLevel": 48,
    "phosphorusLevel": 79,
    "potassiumLevel": 30,
    "createdAt": "8/20/2024"
  },
  {
    "temperature": 82,
    "humidity": 38,
    "soilMoisture": 12,
    "nitrogenLevel": 80,
    "phosphorusLevel": 36,
    "potassiumLevel": 6,
    "createdAt": "6/12/2024"
  },
  {
    "temperature": 30,
    "humidity": 99,
    "soilMoisture": 78,
    "nitrogenLevel": 28,
    "phosphorusLevel": 25,
    "potassiumLevel": 90,
    "createdAt": "5/17/2024"
  },
  {
    "temperature": 2,
    "humidity": 13,
    "soilMoisture": 68,
    "nitrogenLevel": 97,
    "phosphorusLevel": 19,
    "potassiumLevel": 1,
    "createdAt": "11/12/2024"
  },
  {
    "temperature": 95,
    "humidity": 22,
    "soilMoisture": 28,
    "nitrogenLevel": 43,
    "phosphorusLevel": 38,
    "potassiumLevel": 68,
    "createdAt": "2/3/2025"
  },
  {
    "temperature": 29,
    "humidity": 87,
    "soilMoisture": 82,
    "nitrogenLevel": 75,
    "phosphorusLevel": 57,
    "potassiumLevel": 63,
    "createdAt": "10/31/2024"
  },
  {
    "temperature": 6,
    "humidity": 50,
    "soilMoisture": 2,
    "nitrogenLevel": 74,
    "phosphorusLevel": 32,
    "potassiumLevel": 45,
    "createdAt": "4/22/2024"
  },
  {
    "temperature": 8,
    "humidity": 29,
    "soilMoisture": 31,
    "nitrogenLevel": 16,
    "phosphorusLevel": 72,
    "potassiumLevel": 50,
    "createdAt": "9/9/2024"
  },
  {
    "temperature": 13,
    "humidity": 32,
    "soilMoisture": 24,
    "nitrogenLevel": 90,
    "phosphorusLevel": 5,
    "potassiumLevel": 91,
    "createdAt": "9/15/2024"
  }
]
 
const StatisticsDisplay = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({}); // Store statistical analysis

  // useEffect(() => {
  //   // const fetchData = async () => {
  //   //   try {
  //   //     const response = await fetch(API_URL);
  //   //     const result = await response.json();

  //   //     if (result.bitcoin) {
  //   //       const priceData = [
  //   //         {
  //   //           value: result.bitcoin.usd,
  //   //           timestamp: new Date(),
  //   //         },
  //   //       ];
  //   //       setData(priceData); // Store the current price data
  //   //       analyzeData(priceData); // Perform statistical analysis
  //   //     }

  //   //     setLoading(false);
  //   //   } catch (error) {
  //   //     console.error("Error fetching data:", error);
  //   //   }
  //   // };

  //   // fetchData();
  //   // const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

  //   // return () => clearInterval(interval);
  // }, []);
  
  // Function to calculate statistical insights
  interface DataItem {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    nitrogenLevel: number;
    phosphorusLevel: number;
    potassiumLevel: number;
    createdAt: string;
  }
  
  interface Stats {
    avg: number;
    min: number;
    max: number;
    trend: number;
  }
  useEffect(()=>{
    setData(datas);
    const analyzeData = (data: DataItem[]) => {
      if (data.length === 0) return;
      
      const values = data.map((item) => item.temperature );
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const trend = values[values.length - 1] - values[0]; // Last - First Value
      
      setStats({ avg, min, max, trend });
    };
    analyzeData(data);
   },[])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Fetching Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Live Data Statistics</Text>

      {/* Statistical Summary */}
      <View style={styles.card}>
        <Text style={styles.label}>📊 Average: {stats.avg}</Text>
        <Text style={styles.label}>🔺 Max: {stats.max}</Text>
        <Text style={styles.label}>🔻 Min: {stats.min}</Text>
        <Text style={styles.label}>
          📈 Trend: {stats.trend > 0 ? "Increasing" : "Decreasing"}
        </Text>
      </View>

      {/* Data Chart */}
      <LineChart
        data={{
          labels: data.map((_, i) => i.toString()), // X-axis labels
          datasets: [{ data: data.map((item) => item.soilMoisture || 0) }], // Y-axis values
        }}
        width={460}
        height={300}
        chartConfig={chartConfig("#e8e8e8")}
        style={styles.chart}
      />
    </ScrollView>
  );
};

const chartConfig = (color) => ({
  backgroundGradientFrom: "rgb(1, 105, 77)",
  backgroundGradientTo: "rgb(1, 105, 77)",
  decimalPlaces: 2,
  color: (opacity = 1) => `${color}${Math.floor(opacity * 255).toString(16)}`,
  labelColor: () => "#fff",
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "rgb(4, 38, 28)",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "rgb(232, 232, 232)",
    marginBottom: 30,
  },
  chart: { 
    marginVertical: 10,
    borderRadius: 8,
    padding: 5,
  },
  card: {
    padding: 15,
    backgroundColor: "rgb(1, 105, 77)",
    borderRadius: 8,
    width: "90%",
    marginVertical: 5,
  },
  label: {
    fontSize: 18,
    color: "#D1D5DB",
    fontWeight: "600",
    textAlign: "center",
  },
  loadingText: { color: "#ffffff", marginTop: 10 },
});

export default StatisticsDisplay;
