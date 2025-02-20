package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.DTO.SensorDataDTO;
import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Repository.SensorDataRepo;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SensorDataService {
    private final SensorDataRepo sensorDataRepo;

    public SensorDataService(SensorDataRepo sensorDataRepo) {
        this.sensorDataRepo = sensorDataRepo;
    }

    public List<SensorDataDTO> getAllSensorData() {
        List<SensorData> sensorDataList = sensorDataRepo.findAll();

        // Debugging: Print fetched data
        System.out.println("Fetched from DB: " + sensorDataList);

        return sensorDataList.stream().map(data -> SensorDataDTO.builder()
                .temperature(data.getTemperature())
                .humidity(data.getHumidity())
                .soilMoisture(data.getSoilMoisture())
                .nLevel(data.getNLevel())
                .pLevel(data.getPLevel())
                .kLevel(data.getKLevel())
                .build()).collect(Collectors.toList());
    }

    public void saveSensorData(SensorDataDTO sensorDataDTO) {
        SensorData sensorData = SensorData.builder()
                .temperature(sensorDataDTO.getTemperature())
                .humidity(sensorDataDTO.getHumidity())
                .soilMoisture(sensorDataDTO.getSoilMoisture())
                .nLevel(sensorDataDTO.getNLevel())
                .pLevel(sensorDataDTO.getPLevel())
                .kLevel(sensorDataDTO.getKLevel())
                .build();

        sensorDataRepo.save(sensorData);
    }
}


