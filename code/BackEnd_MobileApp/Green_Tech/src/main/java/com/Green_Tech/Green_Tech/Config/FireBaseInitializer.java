package com.Green_Tech.Green_Tech.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.InputStream;

@Configuration
public class FireBaseInitializer {

    @PostConstruct
    public void initializeFirebase() {
//        try {
//            InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("firebasecred.json");
//
//            if (serviceAccount == null) {
//                throw new RuntimeException("firebasecred.json not found in resources folder");
//            }
//
//            FirebaseOptions options = FirebaseOptions.builder()
//                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                    .build();
//
//            if (FirebaseApp.getApps().isEmpty()) {
//                FirebaseApp.initializeApp(options);
//                System.out.println("✅ Firebase initialized successfully");
//            }
//        } catch (Exception e) {
//            System.err.println("❌ Firebase initialization failed: " + e.getMessage());
//            e.printStackTrace();
//        }
    }
}
