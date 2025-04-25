package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import com.Green_Tech.Green_Tech.Service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/device")
public class DeviceController {

    @Autowired
    private DeviceService deviceService;

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

    @GetMapping("/getByUser")
    public ResponseEntity<List<Device>> getDevicesByUser(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        List<Device> devices = deviceService.getDevicesByUser(auth);
        if (devices.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(devices);
    }


    @PostMapping("/add")
    public ResponseEntity<Device> createDevice(@RequestBody Map<String, String> data,
                                               @RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(deviceService.createDevice(data, auth));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable Long id, @RequestBody Device updatedDevice) {
        return deviceService.updateDevice(id, updatedDevice)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Device> deleteDevice(@RequestBody Map<String, String> data,
                                               @RequestHeader("Authorization") String auth) throws UserNotFoundException {
        String mac = data.get("mac");
        if (mac == null || mac.isEmpty()) {
            return ResponseEntity.badRequest().build();  // 400 if mac not provided
        }

        boolean deleted = deviceService.deleteDeviceByMacAndUser(mac, auth);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
