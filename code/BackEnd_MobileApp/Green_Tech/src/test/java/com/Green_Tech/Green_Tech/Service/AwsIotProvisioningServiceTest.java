package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import software.amazon.awssdk.services.iot.IotClient;
import software.amazon.awssdk.services.iot.model.*;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AwsIotProvisioningServiceTest {

   @Mock
   private DeviceRepo deviceRepo;

   @Mock
   private AwsIotCredentialsRepo awsIotCredentialsRepo;

   @Mock
   private IotClient iotClient;

   @InjectMocks
   private AwsIotProvisioningService awsIotProvisioningService;

   @BeforeEach
   public void setUp() {
       MockitoAnnotations.openMocks(this);
       awsIotProvisioningService.setIotClient(iotClient); // inject mock
   }

   @Test
   public void testCreateThing_DeviceFoundAndThingAlreadyExists_ReturnsExistingCredentials() {
       String mac = "AA:BB:CC:DD:EE:FF";
       Device device = new Device();
       device.setId(1L);

       AwsIotCredentials creds = AwsIotCredentials.builder()
               .thingName("esp32-1")
               .certificatePem("dummy-cert")
               .privateKey("private-key")
               .publicKey("public-key")
               .endpoint("endpoint-url")
               .device(device)
               .createdAt(new Date())
               .build();

       when(deviceRepo.findByMac(mac)).thenReturn(device);
       when(iotClient.describeThing(any(DescribeThingRequest.class)))
               .thenReturn(DescribeThingResponse.builder().thingName("esp32-1").build());
       when(awsIotCredentialsRepo.findByDeviceId(device.getId())).thenReturn(creds);

       AwsIotCredentials result = awsIotProvisioningService.createThing(mac);
       assertNotNull(result);
       assertEquals("esp32-1", result.getThingName());
       verify(iotClient).describeThing(any());
   }

   @Test
   public void testCreateThing_DeviceFound_ThingDoesNotExist_CreatesNewThingAndCert() {
       String mac = "11:22:33:44:55:66";
       Device device = new Device();
       device.setId(2L);

       when(deviceRepo.findByMac(mac)).thenReturn(device);
       when(iotClient.describeThing(any())).thenThrow(ResourceNotFoundException.builder().message("Not found").build());
       when(iotClient.createThing(any())).thenReturn(CreateThingResponse.builder().thingName("esp32-2").build());

       CreateKeysAndCertificateResponse certResponse = CreateKeysAndCertificateResponse.builder()
               .certificateArn("arn:aws:iot:cert")
               .certificatePem("cert-pem")
               .keyPair(KeyPair.builder().privateKey("priv-key").publicKey("pub-key").build())
               .build();

       when(iotClient.createKeysAndCertificate(any())).thenReturn(certResponse);
       when(awsIotCredentialsRepo.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

       AwsIotCredentials result = awsIotProvisioningService.createThing(mac);

       assertNotNull(result);
       assertEquals("esp32-2", result.getThingName());
       verify(iotClient).createThing(any());
       verify(iotClient).attachPolicy(any());
       verify(iotClient).attachThingPrincipal(any());
   }

   @Test
   public void testCreateThing_DeviceNotFound_ThrowsException() {
       when(deviceRepo.findByMac("invalid-mac")).thenReturn(null);
       assertThrows(NullPointerException.class, () -> {
           awsIotProvisioningService.createThing("invalid-mac");
       });
   }

   @Test
   public void testCreateThing_CertCreationFails_ThrowsRuntimeException() {
       String mac = "99:88:77:66:55:44";
       Device device = new Device();
       device.setId(3L);

       when(deviceRepo.findByMac(mac)).thenReturn(device);
       when(iotClient.describeThing(any())).thenThrow(ResourceNotFoundException.builder().build());
       when(iotClient.createThing(any())).thenReturn(CreateThingResponse.builder().thingName("esp32-3").build());
       when(iotClient.createKeysAndCertificate(any())).thenThrow(InternalFailureException.builder().message("Fail").build());

       assertThrows(RuntimeException.class, () -> awsIotProvisioningService.createThing(mac));
   }
}
