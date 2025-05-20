package com.Green_Tech.Green_Tech.CustomException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FOUND)
public class DeviceAlreadyFoundException extends Exception{
    public DeviceAlreadyFoundException(String message){
        super(message);
    }
}
