package com.testyourself.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionResponse {
    private Long id;
    private String questionText;
    private List<String> options;
    private String correctAnswer;
    private String explanation;
}
