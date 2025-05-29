package com.Green_Tech.Green_Tech.DTO;

import com.Green_Tech.Green_Tech.Entity.User;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleAuthResponse extends ApiResponse {
    private String action; // "REGISTERED" or "LOGIN"

    public GoogleAuthResponse(String message, Object data, String action) {
        super(message, data);
        this.action = action;
    }
}