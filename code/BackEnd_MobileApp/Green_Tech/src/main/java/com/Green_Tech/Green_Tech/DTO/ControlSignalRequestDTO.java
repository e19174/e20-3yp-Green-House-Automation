package com.Green_Tech.Green_Tech.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControlSignalRequestDTO {
    private int index;
    private boolean status;
    private Long deviceId;
}
