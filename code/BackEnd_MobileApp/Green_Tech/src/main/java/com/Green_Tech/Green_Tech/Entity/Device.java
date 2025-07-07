package com.Green_Tech.Green_Tech.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String mac;
    private Date addedAt;
    private String zoneName;
    private String name;
    private String location;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private boolean active;
    private boolean isThresholdAssigned;
    @OneToOne
    @JoinColumn(name = "plant_id")
    private Plant plant;
}
