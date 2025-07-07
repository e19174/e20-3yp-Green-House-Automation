package com.Green_Tech.Green_Tech.Service.sensorData;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SensorWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendSensorData(Long deviceId, Map<String, Object> data) {
        messagingTemplate.convertAndSend("/topic/device/" + deviceId, data);
    }
}
