package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.Admin;
import com.Green_Tech.Green_Tech.Entity.Plant;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.PlantRepo;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class PlantService {

    @Autowired
    private PlantRepo plantRepo;
    @Autowired
    private ExtractUserService extractUserService;

    public List<Plant> getAllPlants(String auth) throws UserNotFoundException {
        User user = extractUserService.extractUserFromJwt(auth);

        if (user.isEnabled()){
            return plantRepo.findAll();
        }
        return Collections.emptyList();
    }
}
