package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.Entity.Device;
import com.Green_Tech.Green_Tech.Entity.SensorData;
import com.Green_Tech.Green_Tech.Repository.DeviceRepo;
import com.Green_Tech.Green_Tech.Repository.SensorDataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.HashMap;

@ExtendWith(MockitoExtension.class)
public class SensorDataServiceTest {

    @Mock
    private SensorDataRepository sensorDataRepository;

    @Mock
    private DeviceRepo deviceRepo;

    @InjectMocks
    private SensorDataService sensorDataService;

    private byte[] validJsonBytes;

    @BeforeEach
    void setUp() {
        // JSON must match expected AWS format (including MAC)
        String json = """
            {
                "mac": "AA:BB:CC:DD:EE:FF",
                "temperature": 25.5,
                "humidity": 60.0,
                "moisture": 45.0
            }
        """;
        validJsonBytes = json.getBytes();
    }

    @Test
    void testConvertByteArrayToHashMap_withValidJson() {
        HashMap result = sensorDataService.convertByteArrayToHashMap(validJsonBytes);

        assertNotNull(result);
        assertEquals(25.5, (Double) result.get("temperature"));
        assertEquals(60.0, (Double) result.get("humidity"));
        assertEquals(45.0, (Double) result.get("moisture"));
        assertEquals("AA:BB:CC:DD:EE:FF", result.get("mac"));
    }

    @Test
    void testConvertByteArrayToHashMap_withInvalidJson() {
        byte[] badJson = "invalid".getBytes();
        HashMap result = sensorDataService.convertByteArrayToHashMap(badJson);
        assertNull(result); // Should return null on failure
    }

    @Test
    void testGetDataFromAWS_withValidData() throws DeviceNotFoundException {
        // Mocking device
        Device mockDevice = new Device();
        mockDevice.setMac("AA:BB:CC:DD:EE:FF");

        when(deviceRepo.findByMac("AA:BB:CC:DD:EE:FF")).thenReturn(mockDevice);

        // Act
        sensorDataService.getDataFromAWS(validJsonBytes);

        // Assert
        verify(sensorDataRepository, times(1)).save(any(SensorData.class));
    }

    @Test
    void testGetSensorData_callsRepository() {
        Long id = 1L;
        SensorData mockSensorData = SensorData.builder()
                .temperature(25.5)
                .humidity(60.0)
                .soilMoisture(45.0)
                .nitrogenLevel(0.001)
                .phosphorusLevel(0.001)
                .potassiumLevel(0.001)
                .updatedAt(new Date())
                .build();

        when(sensorDataRepository.findFirstByIdOrderByIdDesc(id)).thenReturn(mockSensorData);

        SensorData result = sensorDataService.getSensorData(id);

        assertNotNull(result);
        assertEquals(25.5, result.getTemperature());
        verify(sensorDataRepository, times(1)).findFirstByIdOrderByIdDesc(id);
    }
}
