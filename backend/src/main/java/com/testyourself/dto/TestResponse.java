package com.testyourself.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TestResponse {
    private Long id;
    private String topic;
    private List<QuestionResponse> questions;
    private Integer questionCount;
    private LocalDateTime createdAt;
    private String difficulty;
}
