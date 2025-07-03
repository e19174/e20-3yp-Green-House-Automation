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

        try {
            // Check if thing already exists in AWS
            try {
                DescribeThingResponse existingThing = iotClient.describeThing(
                        DescribeThingRequest.builder()
                                .thingName(thingName)
                                .build()
                );
                System.out.println("Thing already exists in AWS: " + thingName);

                // Check if we have credentials in database
                AwsIotCredentials existingCreds = awsIotCredentialsRepo.findByDeviceId(device.getId());
                if (existingCreds != null) {
                    System.out.println("Returning existing credentials from database");
                    return existingCreds;
                }
                // If thing exists in AWS but not in our DB, we have a problem
                // For now, let's create new credentials (this might create duplicate things)
                System.out.println("Thing exists in AWS but no credentials in DB. Creating new credentials...");

            } catch (ResourceNotFoundException e) {
                // Thing doesn't exist in AWS, proceed with creation
                System.out.println("Thing doesn't exist in AWS, creating new thing: " + thingName);
            }

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
                    .device(device)
                    .certificatePem(certResp.certificatePem())
                    .privateKey(certResp.keyPair().privateKey())
                    .publicKey(certResp.keyPair().publicKey())
                    .createdAt(new Date())
                    .endpoint(endpoint)
                    .build();

            return awsIotCredentialsRepo.save(awsIotCredentials);

        } catch (Exception e) {
            System.err.println("Error creating AWS IoT thing: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create AWS IoT thing: " + e.getMessage());
        }
    }

}
