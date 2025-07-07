package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.Plant;
import com.Green_Tech.Green_Tech.Service.PlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("api/v1/plant")
@RestController
public class PlantController {

    @Autowired
    private PlantService plantService;

    @GetMapping("/getAll")
    public ResponseEntity<List<Plant>> getAllPlants(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(plantService.getAllPlants(auth));
    }
}
