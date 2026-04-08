package com.healthcare.medicationtracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicationName;
    private String dosage;
    private String frequency; // e.g., "DAILY", "TWICE_DAILY", "WEEKLY"
    private LocalDateTime nextDueTime;
    private String instructions;
    private boolean taken;
    private LocalDateTime lastTakenTime;
    private String notes;
    private String email;
    
    // For recurring reminders
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer intervalHours; // Hours between doses
    private Integer intervalMinutes; // Additional minutes between doses
}