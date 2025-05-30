package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import software.amazon.awssdk.services.iot.IotClient;
import software.amazon.awssdk.services.iot.model.*;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AwsIotProvisioningServiceTest {

    @InjectMocks
    private AwsIotProvisioningService awsIotProvisioningService;

    @Mock
    private DeviceRepo deviceRepo;

    @Mock
    private AwsIotCredentialsRepo awsIotCredentialsRepo;

    @Mock
    private IotClient iotClient;

    @Captor
    ArgumentCaptor<AwsIotCredentials> credentialsCaptor;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Manually inject the mock iotClient (normally injected after @PostConstruct)
        awsIotProvisioningService = new AwsIotProvisioningService();
        awsIotProvisioningService.deviceRepo = deviceRepo;
        awsIotProvisioningService.awsIotCredentialsRepo = awsIotCredentialsRepo;
        awsIotProvisioningService.iotClient = iotClient;
        awsIotProvisioningService.endpoint = "mock-endpoint.iot.region.amazonaws.com";
    }

    @Test
    void testCreateThing_successfulProvisioning() {//AAA
        // Arrange
        String mac = "AA:BB:CC:DD:EE";
        Device mockDevice = Device.builder().id(123L).mac(mac).build();

        when(deviceRepo.findByMac(mac)).thenReturn(mockDevice);

        CreateKeysAndCertificateResponse certResponse = CreateKeysAndCertificateResponse.builder()
                .certificateArn("arn:aws:iot:cert123")
                .certificatePem("cert-pem")
                .keyPair(KeyPair.builder()
                        .privateKey("private-key")
                        .publicKey("public-key")
                        .build())
                .build();

        when(iotClient.createThing(any(CreateThingRequest.class))).thenReturn(CreateThingResponse.builder().build());
        when(iotClient.createKeysAndCertificate(any(CreateKeysAndCertificateRequest.class))).thenReturn(certResponse);
        when(awsIotCredentialsRepo.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        AwsIotCredentials result = awsIotProvisioningService.createThing(mac);

        // Assert
        assertNotNull(result);
        assertEquals("esp32-" + mockDevice.getId(), result.getThingName());
        assertEquals("cert-pem", result.getCertificatePem());
        assertEquals("private-key", result.getPrivateKey());
        assertEquals("mock-endpoint.iot.region.amazonaws.com", result.getEndpoint());

        verify(iotClient).attachPolicy(any(AttachPolicyRequest.class));
        verify(iotClient).attachThingPrincipal(any(AttachThingPrincipalRequest.class));
        verify(awsIotCredentialsRepo).save(credentialsCaptor.capture());

        AwsIotCredentials savedCreds = credentialsCaptor.getValue();
        assertEquals(mockDevice, savedCreds.getDevice());
    }
}
