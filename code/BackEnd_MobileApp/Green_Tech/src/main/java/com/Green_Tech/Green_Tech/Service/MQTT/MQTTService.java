package com.Green_Tech.Green_Tech.Service.MQTT;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
import com.Green_Tech.Green_Tech.Service.SensorDataService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
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

    private static final String SENSOR_TOPIC = "ESP32/PUB";
    private static final String CONTROL_TOPIC = "ESP32/SUB";

    private MqttClientConnection connection;

//    @PostConstruct
//    public void startMqttClient() {
//        new Thread(this::connectAndSubscribe).start();
//    }

//    private void connectAndSubscribe() {
//        try {
//            AwsIotMqttConnectionBuilder builder = AwsIotMqttConnectionBuilder.newMtlsBuilderFromPath(
//                    "D:/Study/Engineering/3YP/ESP32/AWS_Certs/device_certificate.crt",
//                    "D:/Study/Engineering/3YP/ESP32/AWS_Certs/private_key.key"
//            );
//
//            builder.withClientId("GreenTech_Client")
//                    .withEndpoint("a1j1bemwj6e7rr-ats.iot.ap-south-1.amazonaws.com")
//                    .withCleanSession(true)
//                    .withProtocolOperationTimeoutMs(60000);
//
//            connection = builder.build();
//            builder.close();
//
//            CompletableFuture<Boolean> connected = connection.connect();
//            connected.get();
//            System.out.println("Connected to MQTT broker!");
//
//            // Subscribe to topic and store data in DB
//            CountDownLatch countDownLatch = new CountDownLatch(1);
//            connection.subscribe(SENSOR_TOPIC, QualityOfService.AT_LEAST_ONCE, (message) -> {
//                String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
//                System.out.println("Received: " + payload);
//                // Save to Database
//                sensorDataService.getDataFromAWS(message.getPayload());
//            }).get();
//
//            countDownLatch.await();
//            connection.disconnect().get();
//            connection.close();
//        } catch (InterruptedException | ExecutionException e) {
//            e.printStackTrace();
//        }
//    }


    ///
    private static final String IOT_ENDPOINT = "a1j1bemwj6e7rr-ats.iot.ap-south-1.amazonaws.com";

    private final ConcurrentHashMap<String, byte[]> deviceDataBuffer = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, MqttClientConnection> deviceConnections = new ConcurrentHashMap<>();

//    @PostConstruct
//    public void init() {
//        new Thread(this::connectAllDevices).start();
//    }

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

    private void connectAndSubscribe(AwsIotCredentials aws) {
        try {
            // Use in-memory PEM content (NOT file paths)
            AwsIotMqttConnectionBuilder builder = AwsIotMqttConnectionBuilder.newMtlsBuilder(
                    aws.getCertificatePem().getBytes(StandardCharsets.UTF_8),
                    aws.getPrivateKey().getBytes(StandardCharsets.UTF_8)
            );

            builder.withClientId("backend-" + aws.getDevice().getId())
                    .withEndpoint(IOT_ENDPOINT)
                    .withCleanSession(true);

            MqttClientConnection connection = builder.build();
            builder.close();

            connection.connect().get(); // Wait until connected
            System.out.println("✅ Connected for device: " + aws.getDevice().getId());

//            String topic = "esp32/" + aws.getDevice().getId() + "/data";
            String topic = "ESP32/PUB";
            connection.subscribe(topic, QualityOfService.AT_LEAST_ONCE, message -> {
                String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
                System.out.println("📩 [" + topic + "] " + payload);
//                deviceDataBuffer.put(aws.getDevice().getId().toString(), message.getPayload());
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


//    // Save every 5 minutes
//    @Scheduled(fixedRate = 300)
//    public void saveSensorData() throws DeviceNotFoundException {
//        for (Map.Entry<String, byte[]> entry : deviceDataBuffer.entrySet()) {
//            sensorDataService.getDataFromAWS(entry.getKey(), entry.getValue());
//        }
//        deviceDataBuffer.clear();
//    }

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
