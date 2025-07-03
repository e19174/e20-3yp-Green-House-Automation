package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Config.JwtService;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.Entity.Admin;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.AdminRepo;
import com.Green_Tech.Green_Tech.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExtractUserService {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private AdminRepo adminRepo;

    public User extractUserFromJwt(String auth) throws UserNotFoundException {
        String token = auth.substring(7);
        String email = jwtService.extractUserEmail(token);
        return userRepo.findByEmail(email).orElseThrow(()->
                new UserNotFoundException("There is no user with "+ email)
        );
    }

    public Admin extractAdminFromJwt(String auth) throws UserNotFoundException {
        String token = auth.substring(7);
        String email = jwtService.extractUserEmail(token);
        return adminRepo.findByEmail(email).orElseThrow(()->
                new UserNotFoundException("There is no user with "+ email)
        );
    }
}
