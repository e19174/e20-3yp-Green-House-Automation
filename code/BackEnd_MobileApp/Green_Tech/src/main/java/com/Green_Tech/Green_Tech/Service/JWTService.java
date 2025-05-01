package com.Green_Tech.Green_Tech.Service;

import com.Green_Tech.Green_Tech.Entity.JWT;
import com.Green_Tech.Green_Tech.Entity.User;
import com.Green_Tech.Green_Tech.Repository.JWTRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class JWTService {

    @Autowired
    private JWTRepo jwtRepo;

    public String generateToken(User user) {
        String token = UUID.randomUUID().toString();
        JWT jwt = JWT.builder()
                .token(token)
                .createdAt(new Date(System.currentTimeMillis()))
                .expiresAt(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
                .user(user)
                .build();

        jwtRepo.save(jwt);
        return token;
    }
}
