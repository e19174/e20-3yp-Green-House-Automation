package com.Green_Tech.Green_Tech.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlantDTO {
    private String name;
    private String description;
    private Double temperatureLow;
    private Double temperatureHigh;
    private Double humidityLow;
    private Double humidityHigh;
    private Double moistureLow;
    private Double moistureHigh;
    private Double nitrogen;
    private Double phosphorus;
    private Double potassium;
    private MultipartFile image;
}
