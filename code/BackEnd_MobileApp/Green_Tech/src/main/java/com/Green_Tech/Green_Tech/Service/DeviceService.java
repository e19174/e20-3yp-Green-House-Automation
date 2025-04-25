package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepo deviceRepository;

    @Autowired
    private ExtractUserService extractUserService;

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
    public Device createDevice(Map<String, String> data, String auth) throws UserNotFoundException {
        // Find user by username
        User user = extractUserService.extractUserFromJwt(auth);

        // Build new device
        Device device = Device.builder()
                .mac(data.get("mac"))
                .addedAt(LocalDateTime.now().toString())  // or another appropriate time format
                .zoneName("undefined")
                .name("undefined")
                .location("undefined")
                .user(user)
                .build();

        return deviceRepository.save(device);
    }

    // Update an existing device
    public Optional<Device> updateDevice(Long id, Device updatedDevice) {
        return deviceRepository.findById(id).map(device -> {
            device.setMac(updatedDevice.getMac());
            device.setAddedAt(updatedDevice.getAddedAt());
            device.setZoneName(updatedDevice.getZoneName());
            device.setName(updatedDevice.getName());
            device.setUser(updatedDevice.getUser());
            return deviceRepository.save(device);
        });
    }

    public boolean deleteDeviceByMacAndUser(String mac, String auth) throws UserNotFoundException {
        User user = extractUserService.extractUserFromJwt(auth);

        Optional<Device> deviceOptional = deviceRepository.findByMacAndUser(mac, user);
        if (deviceOptional.isPresent()) {
            deviceRepository.delete(deviceOptional.get());
            return true;
        } else {
            return false;
        }
    }

}