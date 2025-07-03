//package com.Green_Tech.Green_Tech.Service.MQTT;
//
//import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
//import com.Green_Tech.Green_Tech.Entity.Device;
//import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
//import com.Green_Tech.Green_Tech.Service.SensorDataService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.*;
//import software.amazon.awssdk.crt.mqtt.*;
//
//import java.nio.charset.StandardCharsets;
//import java.util.*;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//
//public class MQTTServiceTest {
//
//    @Mock
//    private SensorDataService sensorDataService;
//
//    @Mock
//    private AwsIotCredentialsRepo awsIotCredentialsRepo;
//
//    @InjectMocks
//    private MQTTService mqttService;
//
//    @BeforeEach
//    public void setUp() {
//        MockitoAnnotations.openMocks(this);
//
//
//
//        // Reset or initialize internal maps before each test
//        mqttService.connectionStatus = new HashMap<>();
//        mqttService.clientMap = new HashMap<>();
//
//        mqttService.endpoint = "test-endpoint.iot.aws.com";
//    }
//
//    @Test
//    public void testConnectAllDevices_Success() {
//        Device device = Device.builder().id(1L).build();
//        AwsIotCredentials creds = AwsIotCredentials.builder()
//                .device(device)
//                .certificatePem("certPem")
//                .privateKey("privateKey")
//                .build();
//
//        when(awsIotCredentialsRepo.findAllByActiveDevices(true)).thenReturn(List.of(creds));
//
//        // Spy on mqttService to mock connectAndSubscribe
//        MQTTService spyService = Mockito.spy(mqttService);
//        doNothing().when(spyService).connectAndSubscribe(any(AwsIotCredentials.class));
//
//        spyService.connectAllDevices();
//
//        verify(spyService, times(1)).connectAndSubscribe(creds);
//    }
//
//    @Test
//    public void testCheckAndReconnectDevices_ReconnectsDisconnected() {
//        Device device = Device.builder().id(1L).build();
//        AwsIotCredentials creds = AwsIotCredentials.builder()
//                .device(device)
//                .certificatePem("certPem")
//                .privateKey("privateKey")
//                .build();
//
//        when(awsIotCredentialsRepo.findAllByActiveDevices(true)).thenReturn(List.of(creds));
//
//        // Set device connection status as disconnected
//        mqttService.connectionStatus.put(device.getId().toString(), false);
//
//        MQTTService spyService = Mockito.spy(mqttService);
//        doNothing().when(spyService).connectAndSubscribe(any(AwsIotCredentials.class));
//
//        spyService.checkAndReconnectDevices();
//
//        verify(spyService, times(1)).connectAndSubscribe(creds);
//    }
//
//    @Test
//    public void testPublishControlSignal_Success() throws Exception {
//        Device device = Device.builder().id(1L).build();
//        AwsIotCredentials creds = AwsIotCredentials.builder()
//                .device(device)
//                .certificatePem("certPem")
//                .privateKey("privateKey")
//                .build();
//
//        when(awsIotCredentialsRepo.findByDeviceId(device.getId())).thenReturn(creds);
//
//        // Mock MqttClient
//        MqttClient mockClient = mock(MqttClient.class);
//        mqttService.clientMap.put(device.getId().toString(), mockClient);
//
//        // Mock publish method to do nothing
//        doNothing().when(mockClient).publish(anyString(), any(byte[].class), any(MqttQoS.class), anyBoolean());
//
//        // No exceptions expected
//        assertDoesNotThrow(() -> mqttService.publishControlSignal("command-message", device.getId()));
//
//        verify(mockClient, times(1)).publish(
//                eq("command/topic"),
//                eq("command-message".getBytes(StandardCharsets.UTF_8)),
//                eq(MqttQoS.AT_LEAST_ONCE),
//                eq(false));
//    }
//
//    @Test
//    public void testPublishControlSignal_DeviceNotFound() throws Exception {
//        when(awsIotCredentialsRepo.findByDeviceId(999L)).thenReturn(null);
//
//        // Should handle missing device gracefully without exceptions
//        assertDoesNotThrow(() -> mqttService.publishControlSignal("test-msg", 999L));
//    }
//
//    @Test
//    public void testPublishControlSignal_ClientNotConnected() throws Exception {
//        Device device = Device.builder().id(1L).build();
//        AwsIotCredentials creds = AwsIotCredentials.builder()
//                .device(device)
//                .certificatePem("certPem")
//                .privateKey("privateKey")
//                .build();
//
//        when(awsIotCredentialsRepo.findByDeviceId(device.getId())).thenReturn(creds);
//
//        // clientMap is empty, so no client for this device
//        mqttService.clientMap.clear();
//
//        // Should not throw even if client is missing
//        assertDoesNotThrow(() -> mqttService.publishControlSignal("msg", device.getId()));
//    }
//}
