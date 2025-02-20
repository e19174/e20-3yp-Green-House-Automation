package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.DTO.SensorDataDTO;
import com.Green_Tech.Green_Tech.Service.SensorDataService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sensor-data")
@CrossOrigin
public class SensorDataController {
    private final SensorDataService sensorDataService;

    public SensorDataController(SensorDataService sensorDataService) {
        this.sensorDataService = sensorDataService;
    }

    @GetMapping("/all")
    public List<SensorDataDTO> getAllSensorData() {
        return sensorDataService.getAllSensorData();
    }

    @PostMapping("/add")
    public String addSensorData(@RequestBody SensorDataDTO sensorDataDTO) {
        sensorDataService.saveSensorData(sensorDataDTO);
        return "Sensor data added successfully!";
    }
}
