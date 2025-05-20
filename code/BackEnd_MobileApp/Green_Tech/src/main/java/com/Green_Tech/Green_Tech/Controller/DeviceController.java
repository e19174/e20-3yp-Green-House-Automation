package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.CustomException.DeviceAlreadyFoundException;
import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Service.AwsIotProvisioningService;
import com.Green_Tech.Green_Tech.Service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/device")
public class DeviceController {

    @Autowired
    private DeviceService deviceService;
    @Autowired
    private AwsIotProvisioningService awsIotProvisioningService;


    @GetMapping("/getAll")
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<Device>> getDevicesByUser(@RequestHeader("Authorization") String auth)
                                                        throws UserNotFoundException {
        List<Device> devices = deviceService.getDevicesByUser(auth);
        if (devices.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(devices);
    }

    @PostMapping("/addDevice")
    public ResponseEntity<AwsIotCredentials> createDevice(@RequestBody Map<String, String> data) throws UserNotFoundException, DeviceAlreadyFoundException {
        return ResponseEntity.ok(deviceService.createDevice(data));
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable("id") Long id, @RequestBody Device updatedDevice)
            throws DeviceNotFoundException {
        return ResponseEntity.ok(deviceService.updateDevice(id, updatedDevice));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        boolean deleted = deviceService.deleteDevice(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/provision-device")
    public ResponseEntity<AwsIotCredentials> provisionDevice(@RequestBody Map<String, String> deviceInfo) {
        AwsIotCredentials credentials = awsIotProvisioningService.createThing(deviceInfo.get("mac"));
        return ResponseEntity.ok(credentials);
    }
}
