package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Config.JwtService;
import com.Green_Tech.Green_Tech.CustomException.UserAlreadyFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.DTO.AuthDTO;
import com.Green_Tech.Green_Tech.DTO.UserDTO;
import com.Green_Tech.Green_Tech.DTO.UserResponseDTO;
import com.Green_Tech.Green_Tech.Entity.Role;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;

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
    @Autowired
    private ExtractUserService extractUserService;


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

    public User updateUser(String auth, UserDTO userDTO, MultipartFile file) throws UserNotFoundException, IOException {

        User user = extractUserService.extractUserFromJwt(auth);

        user.setName(userDTO.getName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        if (file != null && !file.isEmpty()) {
            user.setImageName(file.getOriginalFilename());
            user.setImageData(file.getBytes());
            user.setImageType(file.getContentType());
        }
        return userRepo.save(user);
    }

    public void updateProfilePicture(Long userId, MultipartFile file) throws IOException {
        Optional<User> userOptional = userRepo.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setImageData(file.getBytes());
            userRepo.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public UserResponseDTO getUser(String auth) throws UserNotFoundException {
        User user = extractUserService.extractUserFromJwt(auth);

        String base64Image = null;
        if (user.getImageData() != null) {
            base64Image = Base64.getEncoder().encodeToString(user.getImageData());
        }
        return UserResponseDTO.builder()
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .imageType(user.getImageType())
                .imageName(user.getImageName())
                .imageData(user.getImageData())
                .build();
    }

    public void saveUserWithImage(User user, MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            user.setImageData(file.getBytes());
            user.setImageType(file.getContentType());
            user.setImageName(file.getOriginalFilename());
        }
        userRepo.save(user);
    }
}
