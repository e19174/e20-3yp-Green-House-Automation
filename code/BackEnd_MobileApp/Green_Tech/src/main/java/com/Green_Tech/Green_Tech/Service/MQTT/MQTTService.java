package com.Green_Tech.Green_Tech.Service.MQTT;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
import com.Green_Tech.Green_Tech.Service.SensorDataService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.util.concurrent.*;

@Component
public class MQTTService {

    private static final Logger logger = LoggerFactory.getLogger(MQTTService.class);

    @Autowired
    private SensorDataService sensorDataService;
    @Autowired
    private AwsIotCredentialsRepo awsIotCredentialsRepo;

    @Value("${aws.endpointUrl}")
    private String endpoint;

    @Value("${mqtt.connection.timeout:30}")
    private int connectionTimeoutSeconds;

    @Value("${mqtt.publish.timeout:10}")
    private int publishTimeoutSeconds;

    // Connection management
    private final ConcurrentHashMap<String, MqttClientConnection> deviceConnections = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, CompletableFuture<Void>> connectionFutures = new ConcurrentHashMap<>();

    // Thread pools for better resource management
    private ExecutorService connectionExecutor;
    private ExecutorService messageExecutor;
    private ScheduledExecutorService healthCheckExecutor;

    // Circuit breaker pattern for failed connections
    private final ConcurrentHashMap<String, Integer> connectionFailureCount = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> lastFailureTime = new ConcurrentHashMap<>();
    private static final int MAX_RETRY_ATTEMPTS = 3;
    private static final long RETRY_DELAY_MS = 30000; // 30 seconds

//    @PostConstruct
//    public void init() {
//        // Initialize thread pools with proper sizing
//        connectionExecutor = Executors.newFixedThreadPool(10, r -> {
//            Thread t = new Thread(r, "mqtt-connection-");
//            t.setDaemon(true);
//            return t;
//        });
//
//        messageExecutor = Executors.newFixedThreadPool(20, r -> {
//            Thread t = new Thread(r, "mqtt-message-");
//            t.setDaemon(true);
//            return t;
//        });
//
//        healthCheckExecutor = Executors.newSingleThreadScheduledExecutor(r -> {
//            Thread t = new Thread(r, "mqtt-health-check");
//            t.setDaemon(true);
//            return t;
//        });
//
//        // Start initial connection process
//        connectionExecutor.submit(this::connectAllDevices);
//
//        // Start health check
//        healthCheckExecutor.scheduleWithFixedDelay(this::healthCheck, 60, 60, TimeUnit.SECONDS);
//    }

//    @PreDestroy
//    public void cleanup() {
//        logger.info("Shutting down MQTT service...");
//
//        // Close all connections
//        deviceConnections.values().parallelStream().forEach(connection -> {
//            try {
//                connection.disconnect().get(5, TimeUnit.SECONDS);
//                connection.close();
//            } catch (Exception e) {
//                logger.warn("Error closing connection: {}", e.getMessage());
//            }
//        });
//
//        // Shutdown executors
//        shutdownExecutor(connectionExecutor, "Connection");
//        shutdownExecutor(messageExecutor, "Message");
//        shutdownExecutor(healthCheckExecutor, "HealthCheck");
//    }

    private void shutdownExecutor(ExecutorService executor, String name) {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(10, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            logger.warn("{} executor shutdown interrupted", name);
            executor.shutdownNow();
        }
    }

    public void connectAllDevices() {
        try {
            List<AwsIotCredentials> credentials = awsIotCredentialsRepo.findAllByActiveDevices(true);
            logger.info("Connecting {} devices", credentials.size());

            List<CompletableFuture<Void>> futures = credentials.stream()
                    .map(aws -> CompletableFuture.runAsync(() -> connectAndSubscribe(aws), connectionExecutor))
                    .toList();

            // Wait for all connections with timeout
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                    .orTimeout(connectionTimeoutSeconds * credentials.size(), TimeUnit.SECONDS)
                    .join();

        } catch (Exception e) {
            logger.error("Error connecting devices", e);
        }
    }

    @Scheduled(fixedDelay = 30000) // Every 30 seconds
    public void checkAndConnectNewDevices() {
        try {
            List<AwsIotCredentials> credentials = awsIotCredentialsRepo.findAllByActiveDevices(true);
            for (AwsIotCredentials aws : credentials) {
                String deviceId = aws.getDevice().getId().toString();

                if (!deviceConnections.containsKey(deviceId) && canRetryConnection(deviceId)) {
                    connectionExecutor.submit(() -> connectAndSubscribe(aws));
                }
            }
        } catch (Exception e) {
            logger.error("Error checking new devices", e);
        }
    }

    private boolean canRetryConnection(String deviceId) {
        Integer failureCount = connectionFailureCount.get(deviceId);
        Long lastFailure = lastFailureTime.get(deviceId);

        if (failureCount == null || failureCount < MAX_RETRY_ATTEMPTS) {
            return true;
        }

        if (lastFailure != null && (System.currentTimeMillis() - lastFailure) > RETRY_DELAY_MS) {
            connectionFailureCount.remove(deviceId);
            lastFailureTime.remove(deviceId);
            return true;
        }

        return false;
    }

    private void connectAndSubscribe(AwsIotCredentials aws) {
        String deviceId = aws.getDevice().getId().toString();

        try {
            logger.info("Connecting device: {}", deviceId);

            AwsIotMqttConnectionBuilder builder = AwsIotMqttConnectionBuilder.newMtlsBuilder(
                    aws.getCertificatePem().getBytes(StandardCharsets.UTF_8),
                    aws.getPrivateKey().getBytes(StandardCharsets.UTF_8)
            );

            builder.withClientId("Green_Tech-" + deviceId)
                    .withEndpoint(endpoint)
                    .withCleanSession(true)
                    .withKeepAliveMs(30000) // 30 second keep-alive
                    .withPingTimeoutMs(10000); // 10 second ping timeout

            MqttClientConnection connection = builder.build();
            builder.close();

            // Connect with timeout
            connection.connect()
                    .orTimeout(connectionTimeoutSeconds, TimeUnit.SECONDS)
                    .get();

            logger.info("✅ Connected device: {}", deviceId);

            String topic = "esp32/" + deviceId + "/data";
            connection.subscribe(topic, QualityOfService.AT_LEAST_ONCE, message -> {
                // Process message asynchronously to avoid blocking
                messageExecutor.submit(() -> processMessage(message, topic));
            }).orTimeout(10, TimeUnit.SECONDS).get();

            // Store connection and reset failure count
            deviceConnections.put(deviceId, connection);
            connectionFailureCount.remove(deviceId);
            lastFailureTime.remove(deviceId);

            logger.info("✅ Subscribed to topic: {}", topic);

        } catch (Exception e) {
            logger.error("❌ Error connecting device: {}", deviceId, e);
            recordConnectionFailure(deviceId);
        }
    }

    private void processMessage(MqttMessage message, String topic) {
        try {
            String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
            logger.info("📩 [{}] {}", topic, payload);
            sensorDataService.getDataFromAWS(message.getPayload());
        } catch (DeviceNotFoundException e) {
            logger.error("Device not found for message from topic: {}", topic, e);
        } catch (Exception e) {
            logger.error("Error processing message from topic: {}", topic, e);
        }
    }

    private void recordConnectionFailure(String deviceId) {
        connectionFailureCount.merge(deviceId, 1, Integer::sum);
        lastFailureTime.put(deviceId, System.currentTimeMillis());
    }

    public CompletableFuture<Void> publishControlSignal(String message, Long deviceId) {
        return CompletableFuture.runAsync(() -> {
            String deviceIdStr = deviceId.toString();

            try {
                MqttClientConnection connection = deviceConnections.get(deviceIdStr);

                if (connection == null || !isConnectionHealthy(connection)) {
                    logger.warn("No healthy connection for device: {}, attempting to reconnect", deviceId);
                    reconnectDevice(deviceId);
                    connection = deviceConnections.get(deviceIdStr);

                    if (connection == null) {
                        throw new RuntimeException("Failed to establish connection for device: " + deviceId);
                    }
                }

                String topic = "esp32/" + deviceIdStr + "/command";
                byte[] payload = message.getBytes(StandardCharsets.UTF_8);
                MqttMessage mqttMessage = new MqttMessage(topic, payload, QualityOfService.AT_LEAST_ONCE);

                connection.publish(mqttMessage)
                        .orTimeout(publishTimeoutSeconds, TimeUnit.SECONDS)
                        .get();

                logger.info("✅ Published command to device {}: {}", deviceId, message);

            } catch (Exception e) {
                logger.error("❌ Error publishing to device: {}", deviceId, e);
                throw new RuntimeException("Failed to publish command to device: " + deviceId, e);
            }
        }, messageExecutor);
    }

    private boolean isConnectionHealthy(MqttClientConnection connection) {
        try {
            // Simple health check - you might want to implement ping/pong
            return connection != null; // Add more sophisticated health check if needed
        } catch (Exception e) {
            return false;
        }
    }

    private void reconnectDevice(Long deviceId) {
        try {
            AwsIotCredentials aws = awsIotCredentialsRepo.findByDeviceId(deviceId);
            if (aws != null) {
                // Remove old connection
                MqttClientConnection oldConnection = deviceConnections.remove(deviceId.toString());
                if (oldConnection != null) {
                    try {
                        oldConnection.disconnect().get(5, TimeUnit.SECONDS);
                        oldConnection.close();
                    } catch (Exception e) {
                        logger.warn("Error closing old connection for device: {}", deviceId, e);
                    }
                }

                connectAndSubscribe(aws);
            }
        } catch (Exception e) {
            logger.error("Error reconnecting device: {}", deviceId, e);
        }
    }

    private void healthCheck() {
        logger.debug("Performing health check on {} connections", deviceConnections.size());

        deviceConnections.entrySet().removeIf(entry -> {
            String deviceId = entry.getKey();
            MqttClientConnection connection = entry.getValue();

            if (!isConnectionHealthy(connection)) {
                logger.warn("Unhealthy connection detected for device: {}", deviceId);
                try {
                    connection.disconnect().get(5, TimeUnit.SECONDS);
                    connection.close();
                } catch (Exception e) {
                    logger.warn("Error closing unhealthy connection: {}", e.getMessage());
                }
                return true; // Remove from map
            }
            return false; // Keep in map
        });
    }
}