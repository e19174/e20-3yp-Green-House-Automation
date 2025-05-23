package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Service.MQTT.MQTTService;
import com.Green_Tech.Green_Tech.Service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sensors")
@CrossOrigin
public class SensorDataController {

    @Autowired
    private SensorDataService sensorDataService;

    @Autowired
    private MQTTService mqttService;


    @GetMapping(value = "/currentData")
    public SensorData getAllSensorData() {
        return sensorDataService.getAllSensorData();
    }


    @PostMapping(value = "/controlsignal")
    public String sendControlSignal(@RequestBody Map<String, Object> payload) {
        int deviceIndex = (int) payload.get("index");
        boolean turnOn = (boolean) payload.get("status");

        String deviceName;
        switch (deviceIndex) {
            case 0:
                deviceName = "FAN";
                break;
            case 1:
                deviceName = "NUTRIENTS";
                break;
            case 2:
                deviceName = "WATER";
                break;
            case 3:
                deviceName = "LIGHT";
                break;
            default:
                return "Invalid device index!";
        }

        String command = turnOn ? deviceName + "_ON" : deviceName + "_OFF";
        mqttService.publishControlSignal("{message:\""+command+"\"}");
        return "Command Sent: " + command;
    }

}



