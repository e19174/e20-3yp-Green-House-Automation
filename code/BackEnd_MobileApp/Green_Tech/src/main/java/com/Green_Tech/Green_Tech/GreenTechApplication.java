package com.Green_Tech.Green_Tech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GreenTechApplication {

	public static void main(String[] args) {
		SpringApplication.run(GreenTechApplication.class, args);
	}

}
