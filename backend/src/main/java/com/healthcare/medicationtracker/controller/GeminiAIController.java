package com.healthcare.medicationtracker.controller;

import com.healthcare.medicationtracker.service.GeminiAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class GeminiAIController {

    @Autowired
    private GeminiAIService geminiAIService;

    @GetMapping("/medication-info/{medicationName}")
    public String getMedicationInfo(@PathVariable String medicationName) {
        return geminiAIService.getMedicationInfo(medicationName);
    }

    @PostMapping("/check-interactions")
    public String checkDrugInteractions(@RequestBody List<String> medications) {
        return geminiAIService.checkDrugInteractions(medications);
    }

    @GetMapping("/medication-schedule")
    public String getMedicationReminders(
        @RequestParam String medicationName,
        @RequestParam String schedule
    ) {
        return geminiAIService.getMedicationReminders(medicationName, schedule);
    }
}