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

import java.util.*;

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
    public List<Device> getAllDevices(String auth) {
        return deviceRepository.findAll();
    }

    // Get a device by ID
    public List<Device> getDevicesByUser(String auth) throws UserNotFoundException {
        User user = extractUserService.extractUserFromJwt(auth);
        return deviceRepository.findByUserAndActive(user, false);
    }

    public List<Device> getActiveDevicesByUser(String auth) throws UserNotFoundException {
        User user = extractUserService.extractUserFromJwt(auth);
        return deviceRepository.findByUserAndActive(user, true);
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
                .active(false)
                .build();

        deviceRepository.save(device);

        return awsIotProvisioningService.createThing(data.get("mac"));
    }

    // Update an existing device
    public Device updateDevice(Long id, Map<String, String> updatedDevice) throws DeviceNotFoundException {
        Device device = deviceRepository.findById(id).orElseThrow(
                () -> new DeviceNotFoundException("Device not found!!"));

        device.setZoneName(updatedDevice.get("zoneName"));
        device.setName(updatedDevice.get("name"));
        device.setLocation(updatedDevice.get("location"));
        return deviceRepository.save(device);
    }

    // Delete a device by ID
    public boolean deleteDevice(Long id) {
        return deviceRepository.findById(id).map(device -> {
            deviceRepository.delete(device);
            return true;
        }).orElse(false);
    }

    public Device activateDevice(Long id) throws DeviceNotFoundException {
        Device device = deviceRepository.findById(id).orElseThrow(
                () -> new DeviceNotFoundException("Device not found!!"));

        device.setActive(true);
        return deviceRepository.save(device);
    }

    public Map<String, List<Device>> getActiveDevicesByZone(String auth) throws UserNotFoundException {
        User user = extractUserService.extractUserFromJwt(auth);
        List<Device> devices = deviceRepository.findByUserAndActive(user, true);

        Map<String, List<Device>> zoneDevices = new HashMap<>();

        for( Device device: devices){
            if (!zoneDevices.containsKey(device.getZoneName())){
                List<Device> deviceList = new ArrayList<>();
                deviceList.add(getDeviceDetails(device));
                zoneDevices.put(device.getZoneName(), deviceList);
                continue;
            }
            zoneDevices.get(device.getZoneName()).add(device);
        }

        return zoneDevices;
    }

    private Device getDeviceDetails(Device device) {
        device.getUser().setImageData(null);
        device.getUser().setImageName(null);
        device.getUser().setImageType(null);
        return device;
    }
}
