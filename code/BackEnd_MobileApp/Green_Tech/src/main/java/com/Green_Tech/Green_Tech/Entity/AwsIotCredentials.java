package com.Green_Tech.Green_Tech.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwsIotCredentials {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "device_id")
    private Device device;
    private String thingName;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private String certificatePem;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private String privateKey;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private String publicKey;
    private String endpoint;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date createdAt;
    private boolean active;
}
