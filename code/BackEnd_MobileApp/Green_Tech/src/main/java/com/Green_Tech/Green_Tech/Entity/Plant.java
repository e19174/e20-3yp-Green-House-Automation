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
    private Integer temperature;
    private Integer humidity;
    private Integer moisture;
    private Integer nitrogen;
    private Integer phosphorus;
    private Integer potassium;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;
    private String imageType;
    private String imageName;
}
