package com.healthcare.medicationtracker.service;

import com.healthcare.medicationtracker.config.GeminiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@Service
public class GeminiAIService {

    @Autowired
    private GeminiConfig geminiConfig;

    @Autowired
    private RestTemplate restTemplate;

    public String getMedicationInfo(String medicationName) {
        String prompt = String.format(
            "Provide detailed information about %s medication including:\n" +
            "1. Common uses\n" +
            "2. Typical dosage\n" +
            "3. Important side effects\n" +
            "4. Precautions\n" +
            "Please format the response in a clear, easy-to-read structure.",
            medicationName
        );
        return getGeminiResponse(prompt);
    }

    public String checkDrugInteractions(List<String> medications) {
        String medicationList = String.join(", ", medications);
        String prompt = String.format(
            "Analyze potential interactions between these medications: %s\n" +
            "Please provide:\n" +
            "1. Any known interactions\n" +
            "2. Risk level of each interaction\n" +
            "3. Recommendations for safe usage",
            medicationList
        );
        return getGeminiResponse(prompt);
    }

    public String getMedicationReminders(String medicationName, String schedule) {
        String prompt = String.format(
            "Based on the medication %s and schedule %s, provide:\n" +
            "1. Best times to take the medication\n" +
            "2. Whether it should be taken with food\n" +
            "3. Storage recommendations\n" +
            "4. Tips for maintaining the schedule",
            medicationName, schedule
        );
        return getGeminiResponse(prompt);
    }

    public String generateReminderMessage(String medicationName, String dosage, String username) {
        String prompt = String.format(
            "Generate a friendly, personalized medication reminder message for %s who needs to take %s (dosage: %s). " +
            "The message should be:\n" +
            "1. Encouraging and supportive\n" +
            "2. Include the medication name and dosage\n" +
            "3. Brief but clear (about 2-3 sentences)\n" +
            "4. End with a simple wellness tip",
            username, medicationName, dosage
        );
        return getGeminiResponse(prompt);
    }

    private String getGeminiResponse(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        content.put("text", prompt);
        requestBody.put("contents", List.of(Map.of("parts", List.of(content))));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        
        try {
            Map<String, Object> response = restTemplate.postForObject(
                geminiConfig.getGeminiUrl(),
                request,
                Map.class
            );
            
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) 
                        ((Map<String, Object>) firstCandidate.get("content"))
                        .get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
            return "Could not generate response";
        } catch (Exception e) {
            return "Error getting AI response: " + e.getMessage();
        }
    }
}