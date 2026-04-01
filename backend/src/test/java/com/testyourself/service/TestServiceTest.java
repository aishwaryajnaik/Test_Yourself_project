package com.testyourself.service;

import com.testyourself.dto.TestGenerationRequest;
import com.testyourself.dto.TestResponse;
import com.testyourself.repository.TestRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TestServiceTest {
    
    @Mock
    private TestRepository testRepository;
    
    @Mock
    private AIService aiService;
    
    @InjectMocks
    private TestService testService;
    
    @Test
    void testGenerateTest() {
        TestGenerationRequest request = new TestGenerationRequest();
        request.setTopic("Java Programming");
        request.setQuestionCount(5);
        request.setDifficulty("medium");
        
        String mockAiResponse = """
            [
              {
                "questionText": "What is Java?",
                "options": ["A language", "A framework", "A database", "An OS"],
                "correctAnswer": "A language",
                "explanation": "Java is a programming language"
              }
            ]
            """;
        
        when(aiService.generateQuestions(anyString(), any(), anyInt(), anyString()))
            .thenReturn(mockAiResponse);
        
        when(testRepository.save(any())).thenAnswer(i -> {
            com.testyourself.model.Test test = i.getArgument(0);
            test.setId(1L);
            return test;
        });
        
        TestResponse response = testService.generateTest(request);
        
        assertNotNull(response);
        assertEquals("Java Programming", response.getTopic());
        verify(testRepository, times(1)).save(any());
    }
}
