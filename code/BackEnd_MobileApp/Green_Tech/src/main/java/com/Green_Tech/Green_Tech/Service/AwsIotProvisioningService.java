package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.iot.IotClient;
import software.amazon.awssdk.services.iot.model.*;

import java.util.Date;

@Service
public class AwsIotProvisioningService {
    @Autowired
    private DeviceRepo deviceRepo;
    @Autowired
    private AwsIotCredentialsRepo awsIotCredentialsRepo;

    private final IotClient iotClient;

    public AwsIotProvisioningService() {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(
                "AKIAZ7SAK4VTHQRFATO2",
                "+7AEKW1y5xDZ7X5aNRsdNqXwwzJMdwkCMGhevvoz"
        );

        this.iotClient = IotClient.builder()
                .region(Region.AP_SOUTH_1)
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }

    public AwsIotCredentials createThing(String mac) {
        Device device = deviceRepo.findByMac(mac);
        String thingName = "esp32-" + device.getId();

        // 1. Create Thing
        iotClient.createThing(CreateThingRequest.builder()
                .thingName(thingName)
                .build()
        );

        // 2. Create Certificate
        CreateKeysAndCertificateResponse certResp = iotClient.createKeysAndCertificate(
                CreateKeysAndCertificateRequest.builder()
                        .setAsActive(true)
                        .build()
        );

        // 3. Attach policy
        iotClient.attachPolicy(AttachPolicyRequest.builder()
                .policyName("IOT_policy")
                .target(certResp.certificateArn())
                .build());

        // 4. Attach certificate to thing
        iotClient.attachThingPrincipal(AttachThingPrincipalRequest.builder()
                .thingName(thingName)
                .principal(certResp.certificateArn())
                .build());

        AwsIotCredentials awsIotCredentials = AwsIotCredentials.builder()
                .thingName(thingName)
                .device(device )
                .certificatePem(certResp.certificatePem())
                .privateKey(certResp.keyPair().privateKey())
                .publicKey(certResp.keyPair().publicKey())
                .createdAt(new Date())
                .endpoint("a1j1bemwj6e7rr-ats.iot.ap-south-1.amazonaws.com")
                .active(false)
                .build();

        return awsIotCredentialsRepo.save(awsIotCredentials);

    }

}
