package com.testyourself.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 1000)
    private String questionText;
    
    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    private List<String> options;
    
    @Column(nullable = false)
    private String correctAnswer;
    
    @Column(length = 500)
    private String explanation;
    
    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
