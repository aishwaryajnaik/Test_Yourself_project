package com.testyourself.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
@Slf4j
public class AIService {
    
    @Value("${openai.api.key}")
    private String apiKey;
    
    @Value("${openai.api.url}")
    private String apiUrl;
    
    @Value("${openai.api.model}")
    private String model;
    
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public String generateQuestions(String topic, String content, int count, String difficulty) {
        String prompt = buildPrompt(topic, content, count, difficulty);
        
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("OpenAI API key is not configured. Set OPENAI_API_KEY in environment.");
        }

        try {
            String requestBody = String.format("""
                {
                    "model": "%s",
                    "messages": [
                        {"role": "system", "content": "You are an expert test generator. Generate questions in valid JSON format."},
                        {"role": "user", "content": %s}
                    ],
                    "temperature": 0.7
                }
                """, model, objectMapper.writeValueAsString(prompt));
            
            Request request = new Request.Builder()
                .url(apiUrl)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(requestBody, MediaType.parse("application/json")))
                .build();
            
            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body() != null ? response.body().string() : "";
                if (!response.isSuccessful()) {
                    String details = responseBody.isBlank() ? response.toString() : responseBody;
                    throw new IOException("API call failed (" + response.code() + "): " + details);
                }
                
                JsonNode jsonNode = objectMapper.readTree(responseBody);
                if (jsonNode.has("error")) {
                    throw new IOException("OpenAI error: " + jsonNode.get("error").toString());
                }
                return jsonNode.get("choices").get(0).get("message").get("content").asText();
            }
        } catch (Exception e) {
            log.error("Error generating questions", e);
            throw new RuntimeException("Failed to generate questions: " + e.getMessage());
        }
    }
    
    private String buildPrompt(String topic, String content, int count, String difficulty) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate ").append(count).append(" multiple-choice questions about: ").append(topic);
        prompt.append("\nDifficulty: ").append(difficulty);
        
        if (content != null && !content.isEmpty()) {
            prompt.append("\n\nBased on this content:\n").append(content);
        }
        
        prompt.append("""
            
            Return ONLY a JSON array with this exact structure:
            [
              {
                "questionText": "Question here?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "Option A",
                "explanation": "Brief explanation"
              }
            ]
            """);
        
        return prompt.toString();
    }
}
