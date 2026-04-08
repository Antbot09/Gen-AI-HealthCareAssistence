package com.healthcare.medicationtracker.service;

import com.healthcare.medicationtracker.model.Reminder;
import com.healthcare.medicationtracker.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;
    
    @Autowired
    private GeminiAIService geminiAIService;
    
    @Autowired
    private NotificationService notificationService;

    public Reminder createReminder(Reminder reminder) {
        // Calculate next due time based on frequency and interval
        if (reminder.getIntervalHours() != null) {
            reminder.setNextDueTime(LocalDateTime.now().plusHours(reminder.getIntervalHours()));
        }
        
        // Get AI-powered instructions if none provided
        if (reminder.getInstructions() == null || reminder.getInstructions().isEmpty()) {
            String aiInstructions = geminiAIService.getMedicationReminders(
                reminder.getMedicationName(),
                reminder.getFrequency()
            );
            reminder.setInstructions(aiInstructions);
        }
        
        return reminderRepository.save(reminder);
    }

    public Reminder updateReminder(Long id, Reminder reminder) {
        Reminder existingReminder = reminderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reminder not found"));
        
        existingReminder.setMedicationName(reminder.getMedicationName());
        existingReminder.setDosage(reminder.getDosage());
        existingReminder.setFrequency(reminder.getFrequency());
        existingReminder.setNextDueTime(reminder.getNextDueTime());
        existingReminder.setInstructions(reminder.getInstructions());
        
        return reminderRepository.save(existingReminder);
    }

    public void markReminderAsTaken(Long id) {
        Reminder reminder = reminderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reminder not found"));
        
        reminder.setTaken(true);
        reminder.setLastTakenTime(LocalDateTime.now());
        
        // Calculate next due time for recurring reminders
        if (reminder.getIntervalHours() != null || reminder.getIntervalMinutes() != null) {
            LocalDateTime nextDueTime = LocalDateTime.now();
            if (reminder.getIntervalHours() != null) {
                nextDueTime = nextDueTime.plusHours(reminder.getIntervalHours());
            }
            if (reminder.getIntervalMinutes() != null) {
                nextDueTime = nextDueTime.plusMinutes(reminder.getIntervalMinutes());
            }
            if (reminder.getEndDate() == null || nextDueTime.isBefore(reminder.getEndDate())) {
                Reminder newReminder = new Reminder();
                // Copy properties from current reminder
                newReminder.setMedicationName(reminder.getMedicationName());
                newReminder.setDosage(reminder.getDosage());
                newReminder.setFrequency(reminder.getFrequency());
                newReminder.setInstructions(reminder.getInstructions());
                newReminder.setIntervalHours(reminder.getIntervalHours());
                newReminder.setStartDate(reminder.getStartDate());
                newReminder.setEndDate(reminder.getEndDate());
                newReminder.setNextDueTime(nextDueTime);
                newReminder.setTaken(false);
                
                reminderRepository.save(newReminder);
            }
        }
        
        reminderRepository.save(reminder);
    }

    public void deleteReminder(Long id) {
        reminderRepository.deleteById(id);
    }

    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    public List<Reminder> getDueReminders() {
        return reminderRepository.findDueReminders(LocalDateTime.now());
    }

    // Runs every hour to check for due reminders
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void checkDueReminders() {
        List<Reminder> dueReminders = getDueReminders();
        // Send notifications for due reminders
        for (Reminder r : dueReminders) {
            try {
                if (r.getEmail() != null && !r.getEmail().isEmpty()) {
                    notificationService.sendMedicationReminder(r, r.getEmail());
                } else {
                    // If no email is configured for the reminder, skip or add other notification channels
                }
            } catch (Exception e) {
                // Log and continue with next reminder
                System.err.println("Failed to send notification for reminder id=" + r.getId() + ": " + e.getMessage());
            }
        }
    }

    public Reminder getReminderById(Long id) {
        return reminderRepository.findById(id).orElseThrow(() -> new RuntimeException("Reminder not found"));
    }
}