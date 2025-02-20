package com.Green_Tech.Green_Tech.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sensor_data") // Ensure this matches the MySQL table name
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double temperature;
    private double humidity;
    private double soilMoisture;
    private double nLevel;
    private double pLevel;
    private double kLevel;
}
