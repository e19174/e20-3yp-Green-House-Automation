package com.Green_Tech.Green_Tech.Controller;

import com.Green_Tech.Green_Tech.Config.JwtService;
import com.Green_Tech.Green_Tech.CustomException.UserAlreadyFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.DTO.AuthDTO;
import com.Green_Tech.Green_Tech.DTO.UserDTO;
import com.Green_Tech.Green_Tech.DTO.UserResponseDTO;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/auth/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/create")
    public String createUser() {
        return "User created successfully";
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody AuthDTO authDTO) throws UserAlreadyFoundException {
        return ResponseEntity.ok(userService.createNewUser(authDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody AuthDTO authDTO) throws UserNotFoundException {
        return ResponseEntity.ok(userService.loginUser(authDTO));
    }

    @GetMapping("/getUser")
    public ResponseEntity<UserResponseDTO> getUser(@RequestHeader("Authorization") String auth) throws UserNotFoundException {
        return ResponseEntity.ok(userService.getUser(auth));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadUserImage(
            @RequestHeader("Authorization") String auth,
            @RequestParam("file") MultipartFile file,
            @RequestBody UserDTO userDto) throws UserNotFoundException, IOException {

            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty. Please upload a valid image.");
            }

        return ResponseEntity.ok(userService.updateUser(auth, userDto, file));
    }

}
