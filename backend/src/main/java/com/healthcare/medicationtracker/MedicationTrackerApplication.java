package com.healthcare.medicationtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MedicationTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(MedicationTrackerApplication.class, args);
    }
}