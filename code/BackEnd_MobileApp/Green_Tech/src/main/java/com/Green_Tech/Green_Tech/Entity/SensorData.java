package com.Green_Tech.Green_Tech.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class SensorData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;
    private Double temperature;
    private Double humidity;
    private Double soilMoisture;
    private Double nitrogenLevel;
    private Double phosphorusLevel;
    private Double potassiumLevel;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updatedAt;
}
