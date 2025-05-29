package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.DTO.ControlSignalRequestDTO;
import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Service.MQTT.MQTTService;
import com.Green_Tech.Green_Tech.Service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sensors")
@CrossOrigin
public class SensorDataController {

    @Autowired
    private SensorDataService sensorDataService;

    @Autowired
    private MQTTService mqttService;


    @GetMapping(value = "/currentData/{id}")
    public SensorData getSensorData(@PathVariable("id") Long id) {
        return sensorDataService.getSensorData(id);
    }


    @PostMapping(value = "/controlsignal")
    public String sendControlSignal(@RequestBody ControlSignalRequestDTO payload) {
        int deviceIndex = payload.getIndex();
        boolean turnOn = payload.isStatus();
        Long deviceId = payload.getDeviceId();

        String deviceName;
        switch (deviceIndex) {
            case 0:
                deviceName = "FAN";
                break;
            case 1:
                deviceName = "NUTRIENT_N";
                break;
            case 2:
                deviceName = "NUTRIENT_P";
                break;
            case 3:
                deviceName = "NUTRIENT_K";
                break;
            case 4:
                deviceName = "WATER";
                break;
            default:
                return "Invalid device index!";
        }

        String command = turnOn ? deviceName + "_ON" : deviceName + "_OFF";
        mqttService.publishControlSignal("{message:\""+command+"\"}", deviceId);
        return "Command Sent: " + command;
    }

}



