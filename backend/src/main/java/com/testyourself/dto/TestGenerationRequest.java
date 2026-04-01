package com.testyourself.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TestGenerationRequest {
    @NotBlank(message = "Topic is required")
    private String topic;
    
    private String content;
    
    @Min(value = 1, message = "At least 1 question required")
    @Max(value = 50, message = "Maximum 50 questions allowed")
    private Integer questionCount = 10;
    
    private String difficulty = "medium";
}
