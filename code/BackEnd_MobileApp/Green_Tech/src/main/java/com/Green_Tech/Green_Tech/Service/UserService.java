package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Config.JwtService;
import com.Green_Tech.Green_Tech.CustomException.UserAlreadyFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.DTO.AuthDTO;
import com.Green_Tech.Green_Tech.Entity.Role;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;


    public User createNewUser(AuthDTO authDTO) throws UserAlreadyFoundException {
        // verify user already exists
        if (userRepo.existsByEmail(authDTO.getEmail())) {
            throw new UserAlreadyFoundException("User already exists");
        }

        // verify the password and confirmPassword
        if (!authDTO.getPassword().equals(authDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // validate email format
        if (!authDTO.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

//        // validate password complexity
//        if (authDTO.getPassword().length() < 8 ||!authDTO.getPassword().matches(".*[a-z].*[a-z].*")) {
//            throw new IllegalArgumentException("Password must contain at least 8 characters and contain at least two lowercase letters");
//        }

        // encode password and create user
        String password = passwordEncoder.encode(authDTO.getPassword());
        User user = User.builder()
                .name(authDTO.getEmail().split("@")[0])
                .email(authDTO.getEmail())
                .password(password)
                .createdAt(new Date())
                .updatedAt(new Date())
                .role(Role.USER)
                .build();

        return userRepo.save(user);
    }

    public String loginUser(AuthDTO authDTO) throws UserNotFoundException {
        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authDTO.getEmail(),
                            authDTO.getPassword()
                    )
            );
        }catch (Exception ex){
            throw new UserNotFoundException("User not found with " + authDTO.getEmail() + " this email!!!");
        }

        // validate user exists
        User user = userRepo.findByEmail(authDTO.getEmail()).orElseThrow(()
                -> new UserNotFoundException("User not found"));

        // validate password
        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return jwtService.generateToken(user, user.getRole());
    }
}
