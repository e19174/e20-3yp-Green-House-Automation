package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.Plant;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import com.Green_Tech.Green_Tech.Repository.PlantRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Service
public class PlantService {

    @Autowired
    private PlantRepo plantRepo;
    @Autowired
    private ExtractUserService extractUserService;
    @Autowired
    private DeviceRepo deviceRepo;

    public List<Plant> getAllPlants(String auth) throws UserNotFoundException {
        User user = extractUserService.extractUserFromJwt(auth);

        if (user.isEnabled()){
            return plantRepo.findAll();
        }
        return Collections.emptyList();
    }

    public HashMap convertByteArrayToHashMap(byte[] jsonData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonData, HashMap.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void thresholdConfirmation(byte[] payload) throws DeviceNotFoundException {
        HashMap awsData = convertByteArrayToHashMap(payload);

        String status = (String) awsData.get("status");
        Long deviceId = (Long) awsData.get("deviceId");

        Device device = deviceRepo.findById(deviceId).orElseThrow(() ->
                new DeviceNotFoundException("device not found!"));

        device.setThresholdAssigned(Objects.equals(status, "received"));
        deviceRepo.save(device);
    }
}
