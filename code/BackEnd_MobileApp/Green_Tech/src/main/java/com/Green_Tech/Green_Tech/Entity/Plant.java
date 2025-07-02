package com.Green_Tech.Green_Tech.Entity;

import io.micrometer.common.util.internal.logging.InternalLogger;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Plant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String Description;
    private String temperature;
    private String humidity;
    private String moisture;
    private String nitrogenLevel;
    private String phosphorusLevel;
    private String potassiumLevel;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;
    private String imageType;
    private String imageName;
}
