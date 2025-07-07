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
    private Integer temperature;
    private Integer humidity;
    private Integer moisture;
    private Integer nitrogen;
    private Integer phosphorus;
    private Integer potassium;
    private MultipartFile image;
}
