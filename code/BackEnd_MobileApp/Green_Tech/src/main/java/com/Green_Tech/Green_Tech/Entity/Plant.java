package com.Green_Tech.Green_Tech.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Plant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
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
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;
    private String imageType;
    private String imageName;
}
