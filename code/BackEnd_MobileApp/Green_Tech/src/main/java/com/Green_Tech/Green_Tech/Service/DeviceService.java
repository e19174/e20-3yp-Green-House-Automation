package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.CustomException.DeviceAlreadyFoundException;
import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import com.Green_Tech.Green_Tech.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepo deviceRepository;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ExtractUserService extractUserService;
    @Autowired
    private AwsIotProvisioningService awsIotProvisioningService;


    // Get all devices
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }


    // Get a device by ID
    public List<Device> getDevicesByUser(String auth) throws UserNotFoundException {
        User user = extractUserService.extractUserFromJwt(auth);
        return deviceRepository.findByUser(user);
    }


    // Create a new device
    public AwsIotCredentials createDevice(Map<String, String> data) throws UserNotFoundException, DeviceAlreadyFoundException {
        // Find user by username
        User user = userRepo.findByEmail(data.get("email")).
                orElseThrow(() -> new UserNotFoundException("User not found"));

        if (deviceRepository.existsByMac(data.get("mac"))){
            throw new DeviceAlreadyFoundException("Device Already found!!!");
        }

        // Build new device
        Device device = Device.builder()
                .mac(data.get("mac"))
                .addedAt(new Date())
                .zoneName("undefined")
                .name("undefined")
                .location("undefined")
                .user(user)
                .build();

        deviceRepository.save(device);

        AwsIotCredentials credentials = awsIotProvisioningService.createThing(data.get("mac"));
        return credentials;
    }

    // Update an existing device
    public Device updateDevice(Long id, Device updatedDevice) throws DeviceNotFoundException {
        Device device = deviceRepository.findById(id).orElseThrow(
                () -> new DeviceNotFoundException("Device not found!!"));

        device.setZoneName(updatedDevice.getZoneName());
        device.setName(updatedDevice.getName());
        device.setLocation(updatedDevice.getLocation());
        return deviceRepository.save(device);
    }

    // Delete a device by ID
    public boolean deleteDevice(Long id) {
        return deviceRepository.findById(id).map(device -> {
            deviceRepository.delete(device);
            return true;
        }).orElse(false);
    }
}
