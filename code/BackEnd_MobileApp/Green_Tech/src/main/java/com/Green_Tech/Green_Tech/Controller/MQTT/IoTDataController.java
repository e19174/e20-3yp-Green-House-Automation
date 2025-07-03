package com.Green_Tech.Green_Tech.Controller.MQTT;

import com.Green_Tech.Green_Tech.DTO.SensorDataDTO;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import com.Green_Tech.Green_Tech.Repository.SensorDataRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@Slf4j
@RestController
@RequestMapping("/api/v1/iotData")
@CrossOrigin
public class IoTDataController {

    @Autowired
    private SensorDataRepository sensorDataRepository;
    @Autowired
    private DeviceRepo deviceRepo;

    @PostMapping("/receive")
    public ResponseEntity<String> receiveData(@RequestBody SensorDataDTO dto) {
//        Device device = deviceRepo.findByMac(dto.getDevice());

//        SensorData sensorData = SensorData.builder()
//                .device(device)
//                .humidity(dto.getHumidity())
//                .soilMoisture(dto.getSoilMoisture())
//                .temperature(dto.getTemperature())
//                .nitrogenLevel(dto.getNitrogenLevel())
//                .phosphorusLevel(dto.getPhosphorusLevel())
//                .potassiumLevel(dto.getPotassiumLevel())
//                .actuatorStatus(dto.getActuatorStatus())
//                .updatedAt(new Date())
//                .build();
//
//        sensorDataRepository.save(sensorData);
        log.info("Data received :: {}", dto.toString());
        return ResponseEntity.ok("Data received and saved");
    }
}
