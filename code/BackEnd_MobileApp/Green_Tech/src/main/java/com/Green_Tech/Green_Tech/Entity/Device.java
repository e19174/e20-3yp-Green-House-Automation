package com.Green_Tech.Green_Tech.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String addedAt;
    private String zoneName;
    private String name;
    private String location;
    @ManyToOne
    @JoinColumn(name = "user_id")  // creates a foreign key column 'user_id' in Device table
    private User user;
}
