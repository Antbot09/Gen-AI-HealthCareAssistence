package com.healthcare.medicationtracker.service;

import com.healthcare.medicationtracker.model.Reminder;
import com.healthcare.medicationtracker.repository.ReminderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ReminderServiceTest {

    @Mock
    private ReminderRepository reminderRepository;

    @Mock
    private GeminiAIService geminiAIService;

    @InjectMocks
    private ReminderService reminderService;

    private Reminder testReminder;

    @BeforeEach
    void setUp() {
        testReminder = new Reminder();
        testReminder.setId(1L);
        testReminder.setMedicationName("Test Medicine");
        testReminder.setDosage("10mg");
        testReminder.setFrequency("DAILY");
        testReminder.setNextDueTime(LocalDateTime.now());
        testReminder.setTaken(false);
    }

    @Test
    void createReminderTest() {
        when(reminderRepository.save(any(Reminder.class))).thenReturn(testReminder);
        when(geminiAIService.getMedicationReminders(any(), any())).thenReturn("Test instructions");

        Reminder created = reminderService.createReminder(testReminder);
        assertNotNull(created);
        assertEquals("Test Medicine", created.getMedicationName());
    }

    @Test
    void getDueRemindersTest() {
        List<Reminder> dueReminders = Arrays.asList(testReminder);
        when(reminderRepository.findDueReminders(any(LocalDateTime.class))).thenReturn(dueReminders);

        List<Reminder> found = reminderService.getDueReminders();
        assertFalse(found.isEmpty());
        assertEquals(1, found.size());
    }

    @Test
    void markReminderAsTakenTest() {
        when(reminderRepository.findById(1L)).thenReturn(Optional.of(testReminder));
        when(reminderRepository.save(any(Reminder.class))).thenReturn(testReminder);

        assertDoesNotThrow(() -> reminderService.markReminderAsTaken(1L));
    }
}