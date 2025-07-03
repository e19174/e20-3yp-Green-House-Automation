package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Repository.SensorDataRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SensorDataRepository sensorDataRepository;

    // Sensor threshold limits
    private static final double TEMP_THRESHOLD = 35.0;
    private static final double HUMIDITY_THRESHOLD = 80.0;
    private static final double MOISTURE_THRESHOLD = 30.0;
    private static final double NITROGEN_THRESHOLD = 100.0;
    private static final double PHOSPHORUS_THRESHOLD = 100.0;
    private static final double POTASSIUM_THRESHOLD = 100.0;

    public void checkAndSendSensorAlerts() {
        SensorData latestData = sensorDataRepository.findFirstByOrderByIdDesc();

        if (latestData == null) {
            System.out.println("❗ No sensor data available.");
            return;
        }

        StringBuilder alertMessage = new StringBuilder();

        if (latestData.getTemperature() != null && latestData.getTemperature() > TEMP_THRESHOLD) {
            alertMessage.append("🌡️ High Temperature: ").append(latestData.getTemperature()).append("°C\n");
        }

        if (latestData.getHumidity() != null && latestData.getHumidity() > HUMIDITY_THRESHOLD) {
            alertMessage.append("💧 High Humidity: ").append(latestData.getHumidity()).append("%\n");
        }

        if (latestData.getSoilMoisture() != null && latestData.getSoilMoisture() < MOISTURE_THRESHOLD) {
            alertMessage.append("🌱 Low Soil Moisture: ").append(latestData.getSoilMoisture()).append("%\n");
        }

        if (latestData.getNitrogenLevel() != null && latestData.getNitrogenLevel() > NITROGEN_THRESHOLD) {
            alertMessage.append("🧪 High Nitrogen: ").append(latestData.getNitrogenLevel()).append(" mg/kg\n");
        }

        if (latestData.getPhosphorusLevel() != null && latestData.getPhosphorusLevel() > PHOSPHORUS_THRESHOLD) {
            alertMessage.append("🧪 High Phosphorus: ").append(latestData.getPhosphorusLevel()).append(" mg/kg\n");
        }

        if (latestData.getPotassiumLevel() != null && latestData.getPotassiumLevel() > POTASSIUM_THRESHOLD) {
            alertMessage.append("🧪 High Potassium: ").append(latestData.getPotassiumLevel()).append(" mg/kg\n");
        }

        if (!alertMessage.isEmpty()) {
            String title = "🚨 Sensor Alert!";
            String body = alertMessage.toString().trim();

            Message message = Message.builder()
                    .setTopic("sensor-alerts")  // ✅ Key part: topic-based push
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .putData("alert", body)
                    .build();

            try {
                String response = FirebaseMessaging.getInstance().send(message);
                System.out.println("✅ Notification sent to topic: " + response);
            } catch (Exception e) {
                System.err.println("❌ Failed to send notification: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("✅ All sensor values are within optimal range.");
        }
    }
}
