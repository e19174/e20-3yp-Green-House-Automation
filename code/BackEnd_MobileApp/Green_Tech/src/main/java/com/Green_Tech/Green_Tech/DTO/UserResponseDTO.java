package com.Green_Tech.Green_Tech.DTO;
import com.Green_Tech.Green_Tech.Entity.AuthMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    String name;
    String email;
    Integer phoneNumber;
    byte[] imageData;
    String imageType;
    String imageName;
    AuthMethod authMethod;
}
