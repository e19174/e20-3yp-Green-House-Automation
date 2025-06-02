package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Config.JwtService;
import com.Green_Tech.Green_Tech.CustomException.DeviceNotFoundException;
import com.Green_Tech.Green_Tech.CustomException.UserNotFoundException;
import com.Green_Tech.Green_Tech.DTO.UserResponseDTO;
import com.Green_Tech.Green_Tech.Entity.*;
import com.Green_Tech.Green_Tech.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class AdminService {

    @Autowired
    private AdminRepo adminRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private ExtractUserService extractUserService;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private DeviceRepo deviceRepo;
    @Autowired
    private AwsIotCredentialsRepo awsIotCredentialsRepo;
    @Autowired
    private SensorDataRepository sensorDataRepo;


    public String registerAdmin(Map<String, String> adminData) {
        String email = adminData.get("email");
        String password = adminData.get("password");

        if(adminRepo.existsByEmail(email)){
            return "Email already registered!";
        }

        Admin admin = Admin.builder()
                .email(email)
                .name(email.split("@")[0])
                .password(passwordEncoder.encode(password))
                .role(Role.ADMIN)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();

        adminRepo.save(admin);
        return "Account Created Successfully";
    }

    public Map<String, Object> loginAdmin(Map<String, String> adminData) throws UserNotFoundException {
        String email = adminData.get("email");
        String password = adminData.get("password");

//        try{
//            authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            email,
//                            password
//                    )
//            );
//        }catch (Exception ex){
//            throw new UserNotFoundException("User not found with " + email + " this email!!!");
//        }

        // validate user exists
        Admin admin = adminRepo.findByEmail(email).orElseThrow(()
                -> new UserNotFoundException("User not found"));

        // validate password
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        Map<String, Object> adminDetails = new HashMap<>();

        UserResponseDTO userResponseDTO = UserResponseDTO.builder()
                .name(admin.getName())
                .phoneNumber(admin.getPhoneNumber())
                .email(admin.getEmail())
                .imageType(admin.getImageType())
                .imageName(admin.getImageName())
                .imageData(admin.getImageData())
                .build();

        String token = jwtService.generateToken(admin, admin.getRole());

        adminDetails.put("user", userResponseDTO);
        adminDetails.put("token", token);

        return adminDetails;
    }


    public Admin getAdminData(String auth) throws UserNotFoundException {
        return extractUserService.extractAdminFromJwt(auth);
    }

    public List<User> getAllUsers(String auth) throws UserNotFoundException {
        Admin admin = extractUserService.extractAdminFromJwt(auth);
        if(admin.isEnabled()){
            return userRepo.findAll();
        }
        return Collections.emptyList();
    }

    public List<Device> getAllDevices(String auth) throws UserNotFoundException {
        Admin admin = extractUserService.extractAdminFromJwt(auth);
        if(admin.isEnabled()){
            return deviceRepo.findAll();
        }
        return Collections.emptyList();
    }

    public List<User> addNewUser(String auth, Map<String, Object> userData) throws UserNotFoundException {
        Admin admin = extractUserService.extractAdminFromJwt(auth);

        User user = User.builder()
                .name( (String) userData.get("name"))
                .email( (String) userData.get("email"))
                .phoneNumber((Integer) userData.get("phoneNumber"))
                .authMethod(AuthMethod.EMAIL_PASSWORD)
                .role(Role.USER)
                .createdAt(new Date())
                .password(passwordEncoder.encode("green-tech"))
                .build();

        userRepo.save(user);
        return userRepo.findAll();
    }

    public List<User> updateUser(String auth, Map<String, Object> userData) throws UserNotFoundException {
        Admin admin = extractUserService.extractAdminFromJwt(auth);

        User user = userRepo.findByEmail( (String) userData.get("email"))
                .orElseThrow(() -> new UserNotFoundException("User not found with "+ (String) userData.get("email")));

        user.setName((String) userData.get("name"));
        user.setPhoneNumber((Integer) userData.get("phoneNumber"));
        user.setUpdatedAt(new Date());
        userRepo.save(user);

        return userRepo.findAll();
    }

    public List<User> deleteUser(String auth, Long id) throws UserNotFoundException {
        Admin admin = extractUserService.extractAdminFromJwt(auth);

        User user = userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: "+ id));

        userRepo.delete(user);
        return userRepo.findAll();
    }

    public List<Device> updateDevice(String auth, Map<String, Object> deviceData, Long id) throws DeviceNotFoundException {
        Device device = deviceRepo.findById(id).orElseThrow(
                () -> new DeviceNotFoundException("Device not found!!"));

        device.setZoneName((String) deviceData.get("zoneName"));
        device.setName((String) deviceData.get("name"));
        device.setLocation((String) deviceData.get("location"));
        deviceRepo.save(device);

        return deviceRepo.findAll();
    }

    public List<Device> deleteDevice(String auth, Long id) throws UserNotFoundException {
        Admin admin = extractUserService.extractAdminFromJwt(auth);
        if (deviceRepo.existsById(id)){
            awsIotCredentialsRepo.deleteByDeviceId(id);
            sensorDataRepo.deleteAllByDeviceId(id);
            deviceRepo.deleteById(id);
        }
        return deviceRepo.findAll();
    }

    public Admin updateAdmin(Map<String, Object> adminData, String auth, MultipartFile image) throws UserNotFoundException, IOException {
        Admin admin = extractUserService.extractAdminFromJwt(auth);

        admin.setName((String) adminData.get("name"));
        admin.setPhoneNumber((Integer) adminData.get("phoneNumber"));
        admin.setImageName(image != null ? image.getName() : null);
        admin.setImageType(image != null ? image.getContentType() : null);
        admin.setImageData(image != null ? image.getBytes(): null);
        admin.setUpdatedAt(new Date());

        return adminRepo.save(admin);
    }
}
