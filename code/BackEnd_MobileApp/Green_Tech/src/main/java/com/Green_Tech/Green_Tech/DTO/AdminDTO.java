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
public class AdminDTO {
    private String name;
    private Integer phoneNumber;
    private MultipartFile image;
}
