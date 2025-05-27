package com.Green_Tech.Green_Tech.Service.MQTT;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
import com.Green_Tech.Green_Tech.Service.SensorDataService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.crt.mqtt.MqttClientConnection;
import software.amazon.awssdk.crt.mqtt.MqttMessage;
import software.amazon.awssdk.crt.mqtt.QualityOfService;
import software.amazon.awssdk.iot.AwsIotMqttConnectionBuilder;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MQTTService {

    @Autowired
    private SensorDataService sensorDataService;
    @Autowired
    private AwsIotCredentialsRepo awsIotCredentialsRepo;

    private static final String CONTROL_TOPIC = "ESP32/SUB";

    @Value("${aws.endpointUrl}")
    private String endpoint;
    private MqttClientConnection connection;

    private final ConcurrentHashMap<String, byte[]> deviceDataBuffer = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, MqttClientConnection> deviceConnections = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        new Thread(this::connectAllDevices).start();
    }

    public void connectAllDevices() {
        try {
            List<AwsIotCredentials> credentials = awsIotCredentialsRepo.findAllByActiveDevices(true);
            for (AwsIotCredentials aws : credentials) {
                connectAndSubscribe(aws);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Scheduled(fixedDelay = 10000) // Every 60 seconds
    public void checkAndConnectNewDevices() {
        List<AwsIotCredentials> credentials = awsIotCredentialsRepo.findAllByActiveDevices(true);
        for (AwsIotCredentials aws : credentials) {
            connectAndSubscribeIfNotExists(aws);
        }
    }

    private void connectAndSubscribeIfNotExists(AwsIotCredentials aws) {
        String deviceId = aws.getDevice().getId().toString();
        if (deviceConnections.containsKey(deviceId)) {
            return;
        }

        connectAndSubscribe(aws);
    }

    private void connectAndSubscribe(AwsIotCredentials aws) {
        try {
            // Use in-memory PEM content (NOT file paths)
            AwsIotMqttConnectionBuilder builder = AwsIotMqttConnectionBuilder.newMtlsBuilder(
                    aws.getCertificatePem().getBytes(StandardCharsets.UTF_8),
                    aws.getPrivateKey().getBytes(StandardCharsets.UTF_8)
            );

            builder.withClientId("backend-" + aws.getDevice().getId())
                    .withEndpoint(endpoint)
                    .withCleanSession(true);

            MqttClientConnection connection = builder.build();
            builder.close();

            connection.connect().get(); // Wait until connected
            System.out.println("✅ Connected for deviceId: " + aws.getDevice().getId());

            String topic = "esp32/" + aws.getDevice().getId().toString() + "/data";
            connection.subscribe(topic, QualityOfService.AT_LEAST_ONCE, message -> {
                String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
                System.out.println("📩 [" + topic + "] " + payload);
                try {
                    sensorDataService.getDataFromAWS(message.getPayload());
                } catch (DeviceNotFoundException e) {
                    throw new RuntimeException(e);
                }
            }).get();

            deviceConnections.put(aws.getDevice().getId().toString(), connection);

        } catch (Exception e) {
            System.err.println("❌ Error connecting device: " + aws.getDevice().getId());
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
