package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.CustomException.DeviceAlreadyFoundException;
import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.PlantNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.AwsIotCredentials;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Service.AwsIotProvisioningService;
import com.Green_Tech.Green_Tech.Service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
    public List<Device> getAllDevices(@RequestHeader("Authorization") String auth) {
        return deviceService.getAllDevices(auth);
    }

    @GetMapping("/nonActive")
    public ResponseEntity<List<Device>> getDevicesByUser(@RequestHeader("Authorization") String auth)
                                                        throws UserNotFoundException {
        return ResponseEntity.ok(deviceService.getDevicesByUser(auth));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Device>> getActiveDevicesByUser(@RequestHeader("Authorization") String auth)
                                                        throws UserNotFoundException {
        return ResponseEntity.ok(deviceService.getActiveDevicesByUser(auth));
    }

    @GetMapping("/activeByZones")
    public ResponseEntity<Map<String, List<Device>>> getActiveDevicesByZone(@RequestHeader("Authorization") String auth)
                                                        throws UserNotFoundException {
        return ResponseEntity.ok(deviceService.getActiveDevicesByZone(auth));
    }

    @PostMapping("/addDevice")
    public ResponseEntity<Map<String, Object>> createDevice(@RequestBody Map<String, String> data) throws UserNotFoundException, DeviceAlreadyFoundException {
        try {
            AwsIotCredentials credentials = deviceService.createDevice(data);

            // Create response object matching ESP32 expectations
            Map<String, Object> response = new HashMap<>();
            response.put("certificatePem", credentials.getCertificatePem());
            response.put("privateKey", credentials.getPrivateKey());
            response.put("endpoint", credentials.getEndpoint());
            response.put("thingName", credentials.getThingName());

            // ESP32 expects deviceId as nested object with id field
            Map<String, Object> deviceIdMap = new HashMap<>();
            deviceIdMap.put("id", credentials.getDevice().getId());
            response.put("deviceId", deviceIdMap);

            response.put("message", "Device processed successfully");

            // Log the response for debugging
            System.out.println("Sending response to ESP32: " + response);

            return ResponseEntity.ok(response);

        } catch (UserNotFoundException e) {
            System.err.println("User not found: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);

        } catch (Exception e) {
            System.err.println("Error processing device: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("activate/{id}")
    public ResponseEntity<Device> activateDevice(@PathVariable("id") Long id,
                                                 @RequestBody Map<String, Long> plantData)
                                                throws DeviceNotFoundException, PlantNotFoundException {
        return ResponseEntity.ok(deviceService.activateDevice(id, plantData));
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable("id") Long id, @RequestBody Map<String, String> updatedDevice)
            throws DeviceNotFoundException, PlantNotFoundException {
        return ResponseEntity.ok(deviceService.updateDevice(id, updatedDevice));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Boolean> deleteDevice(@PathVariable Long id) throws DeviceNotFoundException {
        return ResponseEntity.ok(deviceService.deleteDevice(id));
    }

    @PostMapping("/provision-device")
    public ResponseEntity<AwsIotCredentials> provisionDevice(@RequestBody Map<String, String> deviceInfo) {
        AwsIotCredentials credentials = awsIotProvisioningService.createThing(deviceInfo.get("mac"));
        return ResponseEntity.ok(credentials);
    }
}
