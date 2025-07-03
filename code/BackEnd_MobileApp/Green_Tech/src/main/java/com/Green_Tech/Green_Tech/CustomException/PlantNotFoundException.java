package com.Green_Tech.Green_Tech.CustomException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PlantNotFoundException extends Exception{
    public PlantNotFoundException(String mes){
        super(mes);
    }
}
