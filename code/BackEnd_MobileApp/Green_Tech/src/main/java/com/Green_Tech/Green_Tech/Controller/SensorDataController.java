package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.DTO.ControlSignalRequestDTO;
import com.Green_Tech.Green_Tech.Entity.Admin;
import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Service.MQTT.MQTTService;
import com.Green_Tech.Green_Tech.Service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/sensors")
@CrossOrigin
public class SensorDataController {

    @Autowired
    private SensorDataService sensorDataService;

    @Autowired
    private MQTTService mqttService;


    @GetMapping(value = "/currentData/{id}")
    public ResponseEntity<Map<String, Object>> getSensorData(@PathVariable("id") Long id) {
        return ResponseEntity.ok(sensorDataService.getSensorData(id));
    }


    @PostMapping(value = "/controlSignal")
    public String sendControlSignal(@RequestBody ControlSignalRequestDTO payload) {
        int deviceIndex = payload.getIndex();
        boolean turnOn = payload.isStatus();
        Long deviceId = payload.getDeviceId();

        mqttService.publishControlSignal("{\"index\":" + deviceIndex + ", \"status\":"+ turnOn + "}",
                deviceId);
        String[] actuators = {"fan", "nitrogen", "phosphorus", "potassium", "water"};
        return "Command Sent: " + actuators[deviceIndex] + " - " + turnOn;
    }

}



