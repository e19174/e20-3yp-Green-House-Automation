package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Repository.AwsIotCredentialsRepo;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${aws.accessKeyId}")
    private String accessKeyId;
    @Value("${aws.secretKey}")
    private String secretAccessKey;
    @Value("${aws.endpointUrl}")
    private String endpoint;

    private IotClient iotClient;

//    @PostConstruct
//    public void init() {
//        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(
//                accessKeyId,
//                secretAccessKey
//        );
//
//        this.iotClient = IotClient.builder()
//                .region(Region.AP_SOUTH_1)
//                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
//                .build();
//    }

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
                .endpoint(endpoint)
                .build();

        return awsIotCredentialsRepo.save(awsIotCredentials);

    }

}
