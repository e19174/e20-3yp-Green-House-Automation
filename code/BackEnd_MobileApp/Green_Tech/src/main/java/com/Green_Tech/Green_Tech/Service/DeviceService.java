package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.PlantNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.Plant;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.*;
import jakarta.transaction.Transactional;
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
    @Autowired
    private AwsIotCredentialsRepo awsIotCredentialsRepo;
    @Autowired
    private SensorDataRepository sensorDataRepository;
    @Autowired
    private PlantRepo plantRepo;


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
    public AwsIotCredentials createDevice(Map<String, String> data) throws UserNotFoundException {
        // Find user by username
        User user = userRepo.findByEmail(data.get("email"))
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String mac = data.get("mac");

        // Check if device already exists
        if (deviceRepository.existsByMac(mac)) {
            System.out.println("Device already exists, returning existing credentials for MAC: " + mac);

            // Get existing device
            Device existingDevice = deviceRepository.findByMac(mac);

            // Get existing AWS credentials
            AwsIotCredentials existingCredentials = awsIotCredentialsRepo.findByDeviceId(existingDevice.getId());

            if (existingCredentials != null) {
                System.out.println("Found existing credentials for device: " + existingDevice.getId());
                return existingCredentials;
            } else {
                // Device exists but no credentials - this shouldn't happen, but let's handle it
                System.out.println("Device exists but no credentials found. Creating new credentials...");
                return awsIotProvisioningService.createThing(mac);
            }
        }

        // Create new device if it doesn't exist
        Device device = Device.builder()
                .mac(mac)
                .addedAt(new Date())
                .zoneName("undefined")
                .name("undefined")
                .location("undefined")
                .user(user)
                .active(false)
                .build();

        deviceRepository.save(device);
        System.out.println("New device created with ID: " + device.getId());

        return awsIotProvisioningService.createThing(mac);
    }

    // Update an existing device
    public Device updateDevice(Long id, Map<String, String> updatedDevice)
            throws DeviceNotFoundException, PlantNotFoundException {
        Device device = deviceRepository.findById(id).orElseThrow(
                () -> new DeviceNotFoundException("Device not found!!"));

        Plant plant = plantRepo.findById(Long.valueOf(updatedDevice.get("plantId"))).orElseThrow(() ->
                new PlantNotFoundException("Plant not found!"));

        device.setZoneName(updatedDevice.get("zoneName"));
        device.setName(updatedDevice.get("name"));
        device.setLocation(updatedDevice.get("location"));
        device.setPlant(plant);

        return deviceRepository.save(device);
    }

    // Delete a device by ID
    @Transactional
    public boolean deleteDevice(Long id) throws DeviceNotFoundException {
        if (deviceRepository.existsById(id)){
            awsIotCredentialsRepo.deleteByDeviceId(id);
            sensorDataRepository.deleteAllByDeviceId(id);
            deviceRepository.deleteById(id);
            return true;
        }
        throw new DeviceNotFoundException("device not Found!");
    }

    public Device activateDevice(Long id, Map<String, Long> plantData) throws DeviceNotFoundException, PlantNotFoundException {
        Device device = deviceRepository.findById(id).orElseThrow(
                () -> new DeviceNotFoundException("Device not found!!"));

        Plant plant = plantRepo.findById(plantData.get("plantId")).orElseThrow(() ->
                new PlantNotFoundException("Plant not found!"));

        device.setActive(true);
        device.setPlant(plant);
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