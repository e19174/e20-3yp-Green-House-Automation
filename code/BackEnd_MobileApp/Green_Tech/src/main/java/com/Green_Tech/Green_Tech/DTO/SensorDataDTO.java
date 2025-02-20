package com.Green_Tech.Green_Tech.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorDataDTO {
    private double temperature;
    private double humidity;
    private double soilMoisture;
    private double nLevel;
    private double pLevel;
    private double kLevel;
}
