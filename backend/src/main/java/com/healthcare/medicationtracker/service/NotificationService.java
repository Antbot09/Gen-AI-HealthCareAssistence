package com.healthcare.medicationtracker.service;

import com.healthcare.medicationtracker.model.Reminder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class NotificationService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private GeminiAIService geminiAIService;

    private static final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

    public void sendMedicationReminder(Reminder reminder, String email) {
        try {
            String message = geminiAIService.generateReminderMessage(
                reminder.getMedicationName(),
                reminder.getDosage(),
                reminder.getInstructions()
            );

            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Medication Reminder: " + reminder.getMedicationName());

            String htmlContent = String.format(
                "<div style='font-family: Arial, sans-serif; padding: 20px;'>" +
                "<h2 style='color: #2196F3;'>Medication Reminder</h2>" +
                "<p>%s</p>" +
                "<div style='background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;'>" +
                "<p><strong>Medication:</strong> %s</p>" +
                "<p><strong>Dosage:</strong> %s</p>" +
                "<p><strong>Time:</strong> %s</p>" +
                "%s" + // Instructions if available
                "</div>" +
                "<p style='font-size: 12px; color: #666; margin-top: 20px;'>" +
                "This is an automated reminder from your Medication Tracker app. " +
                "Please do not reply to this email.</p>" +
                "</div>",
                message,
                reminder.getMedicationName(),
                reminder.getDosage(),
                reminder.getNextDueTime().format(timeFormatter),
                reminder.getInstructions() != null && !reminder.getInstructions().isEmpty() ?
                    String.format("<p><strong>Instructions:</strong> %s</p>", reminder.getInstructions()) : ""
            );

            helper.setText(htmlContent, true);
            emailSender.send(mimeMessage);
            log.info("Reminder email sent successfully to {}", email);
        } catch (MessagingException e) {
            log.error("Failed to send reminder email: {}", e.getMessage());
            throw new RuntimeException("Failed to send reminder email", e);
        }
    }
}