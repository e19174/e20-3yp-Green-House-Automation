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
@RequestMapping("/api/v1/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody Map<String, String> adminData){
        return ResponseEntity.ok(adminService.registerAdmin(adminData));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginAdmin(@RequestBody Map<String, String> adminData)
            throws UserNotFoundException {
        return ResponseEntity.ok(adminService.loginAdmin(adminData));
    }

    @PutMapping("/update")
    public ResponseEntity<Admin> updateAdmin(@ModelAttribute Map<String, Object> adminData,
                                             @RequestHeader("Authorization") String auth,
                                             @RequestParam(value = "image", required = false) MultipartFile image)
            throws UserNotFoundException, IOException {
        return ResponseEntity.ok(adminService.updateAdmin(adminData, auth, image));
    }

    @GetMapping("/adminData")
    public ResponseEntity<Admin> getAdminData(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.getAdminData(auth));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.getAllUsers(auth));
    }

    @GetMapping("/getAllDevices")
    public ResponseEntity<List<Device>> getAllDevices(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.getAllDevices(auth));
    }

    @PostMapping("/addUser")
    public ResponseEntity<List<User>> addNewUser(@RequestHeader("Authorization") String auth,
                                                 @RequestBody Map<String, Object> userData) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.addNewUser(auth, userData));
    }

    @PutMapping("/updateUser")
    public ResponseEntity<List<User>> updateUser(@RequestHeader("Authorization") String auth,
                                                 @RequestBody Map<String, Object> userData) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.updateUser(auth, userData));
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<List<User>> deleteUser(@RequestHeader("Authorization") String auth,
                                                 @PathVariable("id") Long id) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.deleteUser(auth, id));
    }

    @PutMapping("/updateDevice/{id}")
    public ResponseEntity<List<Device>> updateDevice(@RequestHeader("Authorization") String auth,
                                                     @RequestBody Map<String, Object> userData,
                                                     @PathVariable("id") Long id) throws UserNotFoundException, DeviceNotFoundException {
        return ResponseEntity.ok(adminService.updateDevice(auth, userData, id));
    }

    @DeleteMapping("/deleteDevice/{id}")
    public ResponseEntity<List<Device>> deleteDevice(@RequestHeader("Authorization") String auth,
                                                 @PathVariable("id") Long id) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.deleteDevice(auth, id));
    }


    // plants //

    @PostMapping("/addPlant")
    public ResponseEntity<List<Plant>> addNewPlant(@RequestHeader("Authorization") String auth,
                                                   @ModelAttribute PlantDTO plantData)
            throws UserNotFoundException, IOException {
        MultipartFile file = plantData.getImage();
        return ResponseEntity.ok(adminService.addNewPlant(auth, plantData, file));
    }

    @PutMapping("/updatePlant/{id}")
    public ResponseEntity<List<Plant>> updatePlant(@RequestHeader("Authorization") String auth,
                                                   @ModelAttribute PlantDTO plantData,
                                                   @PathVariable("id") Long id)
            throws UserNotFoundException, PlantNotFoundException, IOException {
        return ResponseEntity.ok(adminService.updatePlant(auth, plantData, id));
    }

    @DeleteMapping("/deletePlant/{id}")
    public ResponseEntity<List<Plant>> deletePlant(@RequestHeader("Authorization") String auth,
                                                   @PathVariable("id") Long id) throws UserNotFoundException, PlantNotFoundException {
        return ResponseEntity.ok(adminService.deletePlant(auth, id));
    }

    @GetMapping("/getAllPlants")
    public ResponseEntity<List<Plant>> getAllPlants(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(adminService.getAllPlants(auth));
    }


}
