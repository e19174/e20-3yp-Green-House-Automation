package com.Green_Tech.Green_Tech.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GoogleAuthDto {
    private String email;
    private String name;
    private String profileImage;
    private String clerkUserId;
}
