package com.Green_Tech.Green_Tech.DTO;

import com.Green_Tech.Green_Tech.Entity.Device;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SensorDataDTO {
    private String device;
    private Double temperature;
    private Double humidity;
    private Double soilMoisture;
    private Double nitrogenLevel;
    private Double phosphorusLevel;
    private Double potassiumLevel;
    private boolean[] actuatorStatus = new boolean[5];
}
