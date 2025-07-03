package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.PlantNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.DTO.PlantDTO;
import com.Green_Tech.Green_Tech.Entity.Admin;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.Plant;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Service.AdminService;
import jakarta.servlet.annotation.MultipartConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/admin-register")
    public ResponseEntity<String> registerAdmin(@RequestBody Map<String, String> adminData){
        return ResponseEntity.ok(adminService.registerAdmin(adminData));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<Map<String, Object>> loginAdmin(@RequestBody Map<String, String> adminData) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.loginAdmin(adminData));
    }

    @PutMapping("admin/update")
    public ResponseEntity<Admin> updateAdmin(@RequestBody Map<String, Object> adminData,
                                             @RequestHeader("Authorization") String auth,
                                             @RequestParam(value = "image", required = false) MultipartFile image) throws UserNotFoundException, IOException {
        return ResponseEntity.ok(adminService.updateAdmin(adminData, auth, image));
    }

    @GetMapping("admin/adminData")
    public ResponseEntity<Admin> getAdminData(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.getAdminData(auth));
    }

    @GetMapping("admin/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.getAllUsers(auth));
    }

    @GetMapping("admin/getAllDevices")
    public ResponseEntity<List<Device>> getAllDevices(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.getAllDevices(auth));
    }

    @PostMapping("admin/addUser")
    public ResponseEntity<List<User>> addNewUser(@RequestHeader("Authorization") String auth,
                                                 @RequestBody Map<String, Object> userData) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.addNewUser(auth, userData));
    }

    @PutMapping("admin/updateUser")
    public ResponseEntity<List<User>> updateUser(@RequestHeader("Authorization") String auth,
                                                 @RequestBody Map<String, Object> userData) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.updateUser(auth, userData));
    }

    @DeleteMapping("admin/deleteUser/{id}")
    public ResponseEntity<List<User>> deleteUser(@RequestHeader("Authorization") String auth,
                                                 @PathVariable("id") Long id) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.deleteUser(auth, id));
    }

    @PutMapping("admin/updateDevice/{id}")
    public ResponseEntity<List<Device>> updateDevice(@RequestHeader("Authorization") String auth,
                                                     @RequestBody Map<String, Object> userData,
                                                     @PathVariable("id") Long id) throws UserNotFoundException, DeviceNotFoundException {
        return ResponseEntity.ok(adminService.updateDevice(auth, userData, id));
    }

    @DeleteMapping("admin/deleteDevice/{id}")
    public ResponseEntity<List<Device>> deleteDevice(@RequestHeader("Authorization") String auth,
                                                 @PathVariable("id") Long id) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.deleteDevice(auth, id));
    }


    // plants //

    @PostMapping("admin/addPlant")
    public ResponseEntity<List<Plant>> addNewPlant(@RequestHeader("Authorization") String auth,
                                                   @RequestBody PlantDTO plantData,
                                                   @RequestParam(value = "Image", required = false) MultipartFile file)
            throws UserNotFoundException, IOException {
        return ResponseEntity.ok(adminService.addNewPlant(auth, plantData, file));
    }

    @PutMapping("admin/updatePlant")
    public ResponseEntity<List<Plant>> updatePlant(@RequestHeader("Authorization") String auth,
                                                 @RequestBody Map<String, String> plantData) throws UserNotFoundException, PlantNotFoundException {
        return ResponseEntity.ok(adminService.updatePlant(auth, plantData));
    }

    @DeleteMapping("admin/deletePlant/{id}")
    public ResponseEntity<List<Plant>> deletePlant(@RequestHeader("Authorization") String auth,
                                                   @PathVariable("id") Long id) throws UserNotFoundException, PlantNotFoundException {
        return ResponseEntity.ok(adminService.deletePlant(auth, id));
    }

    @GetMapping("admin/getAllPlants")
    public ResponseEntity<List<Plant>> getAllPlants(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.getAllPlants(auth));
    }


}
