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
import java.util.List;
import java.util.Map;

@Service
public class SensorDataService {

    @Autowired
    private SensorDataRepository sensorDataRepository;
    @Autowired
    private DeviceRepo deviceRepo;

    public Map<String, Object> getSensorData(Long id) {
        SensorData data = sensorDataRepository.findFirstByDeviceIdOrderByIdDesc(id);
        Map<String, Object> sensorData = new HashMap<>();
        sensorData.put("temperature", data.getTemperature());
        sensorData.put("humidity", data.getHumidity());
        sensorData.put("soilMoisture", data.getSoilMoisture());
        sensorData.put("nitrogenLevel", data.getNitrogenLevel());
        sensorData.put("phosphorusLevel", data.getPhosphorusLevel());
        sensorData.put("potassiumLevel", data.getPotassiumLevel());
        sensorData.put("actuatorStatus", data.getActuatorStatus());

        return sensorData;
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
                .nitrogenLevel(awsData.get("nitrogenLevel") instanceof Integer ? Double.valueOf((Integer) awsData.get("nitrogenLevel"))
                        : (Double) awsData.get("nitrogenLevel"))
                .phosphorusLevel(awsData.get("phosphorusLevel") instanceof Integer ? Double.valueOf((Integer) awsData.get("phosphorusLevel"))
                        : (Double) awsData.get("phosphorusLevel"))
                .potassiumLevel(awsData.get("potassiumLevel") instanceof Integer ? Double.valueOf((Integer) awsData.get("potassiumLevel"))
                        : (Double) awsData.get("potassiumLevel"))
                .actuatorStatus(convertListToBoolArray((List<Boolean>) awsData.get("actuatorState")))
                .updatedAt(new Date())
                .build();

        sensorDataRepository.save(sensorData);
    }

    private boolean[] convertListToBoolArray(List<Boolean> list) {
        boolean[] result = new boolean[list.size()];
        for (int i = 0; i < list.size(); i++) {
            result[i] = list.get(i);
        }
        return result;
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
