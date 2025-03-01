package com.Green_Tech.Green_Tech.Service.MQTT;

import com.Green_Tech.Green_Tech.Service.SensorDataService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.crt.mqtt.MqttClientConnection;
import software.amazon.awssdk.crt.mqtt.MqttMessage;
import software.amazon.awssdk.crt.mqtt.QualityOfService;
import software.amazon.awssdk.iot.AwsIotMqttConnectionBuilder;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

@Component
public class MQTTService {

    @Autowired
    private SensorDataService sensorDataService;

    private static final String SENSOR_TOPIC = "ESP32/PUB";
    private static final String CONTROL_TOPIC = "ESP32/SUB";

    private MqttClientConnection connection;

    @PostConstruct
    public void startMqttClient() {
        new Thread(this::connectAndSubscribe).start();
    }

    private void connectAndSubscribe() {
        try {
            AwsIotMqttConnectionBuilder builder = AwsIotMqttConnectionBuilder.newMtlsBuilderFromPath(
                    "D:/Study/Engineering/3YP/ESP32/AWS_Certs/device_certificate.crt",
                    "D:/Study/Engineering/3YP/ESP32/AWS_Certs/private_key.key"
//                    "C:/Users/USER/Downloads/device_certificate.crt",
//                    "C:/Users/USER/Downloads/private_key.key"
            );

            builder.withClientId("GreenTech_Client")
                    .withEndpoint("a1j1bemwj6e7rr-ats.iot.ap-south-1.amazonaws.com")
                    .withCleanSession(true)
                    .withProtocolOperationTimeoutMs(60000);

            connection = builder.build();
            builder.close();

            CompletableFuture<Boolean> connected = connection.connect();
            connected.get();
            System.out.println("Connected to MQTT broker!");

            // Subscribe to topic and store data in DB
            CountDownLatch countDownLatch = new CountDownLatch(1);
            connection.subscribe(SENSOR_TOPIC, QualityOfService.AT_LEAST_ONCE, (message) -> {
                String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
                System.out.println("Received: " + payload);
                // Save to Database
                sensorDataService.getDataFromAWS(message.getPayload());
            }).get();

            countDownLatch.await();
            connection.disconnect().get();
            connection.close();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    public void publishControlSignal(String message) {
        try {
            if (connection != null) {
                // Convert message to byte array
                byte[] payload = message.getBytes(StandardCharsets.UTF_8);

                // Create MQTT Message
                MqttMessage mqttMessage = new MqttMessage(CONTROL_TOPIC, payload, QualityOfService.AT_LEAST_ONCE);

                // Publish using correct parameters
                CompletableFuture<Integer> publishFuture = connection.publish(mqttMessage);

                publishFuture.get(); // Wait for message to be published
                System.out.println("Published: " + message);
            } else {
                System.out.println("MQTT connection is null, cannot publish message.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
