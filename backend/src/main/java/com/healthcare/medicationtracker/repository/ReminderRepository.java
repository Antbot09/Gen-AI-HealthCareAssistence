package com.healthcare.medicationtracker.repository;

import com.healthcare.medicationtracker.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByNextDueTimeBetweenAndTakenFalse(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT r FROM Reminder r WHERE r.nextDueTime <= :now AND r.taken = false")
    List<Reminder> findDueReminders(LocalDateTime now);
    
    List<Reminder> findByMedicationNameContainingIgnoreCase(String medicationName);
}