package com.healthcare.medicationtracker.controller;

import com.healthcare.medicationtracker.model.Reminder;
import com.healthcare.medicationtracker.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;
    
    @Autowired
    private com.healthcare.medicationtracker.service.NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder) {
        return ResponseEntity.ok(reminderService.createReminder(reminder));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(
            @PathVariable Long id,
            @RequestBody Reminder reminder) {
        return ResponseEntity.ok(reminderService.updateReminder(id, reminder));
    }

    @PostMapping("/{id}/take")
    public ResponseEntity<Void> markReminderAsTaken(@PathVariable Long id) {
        reminderService.markReminderAsTaken(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getAllReminders() {
        return ResponseEntity.ok(reminderService.getAllReminders());
    }

    @GetMapping("/due")
    public ResponseEntity<List<Reminder>> getDueReminders() {
        return ResponseEntity.ok(reminderService.getDueReminders());
    }

    @PostMapping("/{id}/notify")
    public ResponseEntity<Void> sendNotificationNow(@PathVariable Long id) {
        Reminder reminder = reminderService.getReminderById(id);
        if (reminder.getEmail() == null || reminder.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        notificationService.sendMedicationReminder(reminder, reminder.getEmail());
        return ResponseEntity.ok().build();
    }
}