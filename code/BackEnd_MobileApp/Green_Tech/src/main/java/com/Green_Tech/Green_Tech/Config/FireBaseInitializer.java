package com.Green_Tech.Green_Tech.Config;

//import java.io.FileInputStream;
//
//import javax.annotation.PostConstruct;
//
//import org.springframework.context.annotation.Configuration;
//
//import com.google.auth.oauth2.GoogleCredentials;
//import com.google.firebase.FirebaseApp;
//import com.google.firebase.FirebaseOptions;

//@Configuration
//public class FireBaseInitializer {
//		try {
////			FirebaseOptions file = FirebaseOptions.builder().setCredentials(
////					GoogleCredentials.fromStream(this.getClass().getClassLoader().getResourceAsStream("fir-fcm-v1-firebase.json")))
////					.build();
////
////			System.out.println("Check File : "+file);
//
//        FileInputStream serviceAccount = new FileInputStream();
//        //System.out.println("Service Acc File: "+serviceAccount);
//
//        FirebaseOptions options = new FirebaseOptions.Builder()
//                .setCredentials(GoogleCredentials.fromStream(serviceAccount)).build();
//        //System.out.println("Got IT: "+options);
//        if(FirebaseApp.getApps().isEmpty()) {
//            FirebaseApp.initializeApp(options);
//            System.out.println("Firebase App initialized successfully!");
//        }else {
//            System.out.println("Else :Firebase App already initialized.");
//        }
//
//    } catch (Exception e) {
//        e.printStackTrace();
//    }
//}
//
//}