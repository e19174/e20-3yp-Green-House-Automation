package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.DTO.SensorDataDTO;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import com.Green_Tech.Green_Tech.Repository.SensorDataRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;

@Service
public class SensorDataService {

    @Autowired
    private SensorDataRepository sensorDataRepository;
    @Autowired
    private DeviceRepo deviceRepo;

    public SensorData getAllSensorData() {
        return sensorDataRepository.findFirstByOrderByIdDesc();
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
    public void getDataFromAWS(byte[] data) throws DeviceNotFoundException {
        HashMap awsData = convertByteArrayToHashMap(data);
        assert awsData != null;

        Device device = deviceRepo.findByMac((String) awsData.get("mac"));

        SensorData sensorData = SensorData.builder()
                .device(device)
                .humidity(awsData.get("humidity") instanceof Integer ? Double.valueOf((Integer) awsData.get("humidity"))
                        : (Double) awsData.get("humidity"))
                .soilMoisture(awsData.get("moisture") instanceof Integer ? Double.valueOf((Integer) awsData.get("moisture"))
                        : (Double) awsData.get("moisture"))
                .temperature(awsData.get("temperature") instanceof Integer ? Double.valueOf((Integer) awsData.get("temperature"))
                        : (Double) awsData.get("temperature"))
                .nitrogenLevel(0.001)
                .phosphorusLevel(0.001)
                .potassiumLevel(0.001)
                .updatedAt(new Date())
                .build();

        sensorDataRepository.save(sensorData);
    }


    private SensorDataDTO convertToDTO(SensorData sensorData) {
        return new SensorDataDTO(
                sensorData.getTemperature(),
                sensorData.getHumidity(),
                sensorData.getSoilMoisture(),
                sensorData.getNitrogenLevel(),
                sensorData.getPhosphorusLevel(),
                sensorData.getPotassiumLevel()
        );
    }
}
