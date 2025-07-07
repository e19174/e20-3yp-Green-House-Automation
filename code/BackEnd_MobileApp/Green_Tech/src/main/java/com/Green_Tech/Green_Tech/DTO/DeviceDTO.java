package com.Green_Tech.Green_Tech.DTO;

import com.Green_Tech.Green_Tech.Entity.Plant;
import com.Green_Tech.Green_Tech.Entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeviceDTO {
    private Long id;
    private String mac;
    private Date addedAt;
    private String zoneName;
    private String name;
    private String location;
    private Long userId;
    private boolean active;
    private Long plantId;
}
