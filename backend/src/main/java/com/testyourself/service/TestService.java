package com.testyourself.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.testyourself.dto.QuestionResponse;
import com.testyourself.dto.TestGenerationRequest;
import com.testyourself.dto.TestResponse;
import com.testyourself.model.Question;
import com.testyourself.model.Test;
import com.testyourself.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestService {
    
    private final TestRepository testRepository;
    private final AIService aiService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Transactional
    public TestResponse generateTest(TestGenerationRequest request) {
        String aiResponse = aiService.generateQuestions(
            request.getTopic(),
            request.getContent(),
            request.getQuestionCount(),
            request.getDifficulty()
        );
        
        Test test = new Test();
        test.setTopic(request.getTopic());
        test.setSourceContent(request.getContent());
        test.setQuestionCount(request.getQuestionCount());
        test.setDifficulty(request.getDifficulty());
        
        try {
            String cleanJson = extractJson(aiResponse);
            List<Map<String, Object>> questionsData = objectMapper.readValue(
                cleanJson, 
                new TypeReference<List<Map<String, Object>>>() {}
            );
            
            for (Map<String, Object> qData : questionsData) {
                String questionText = (String) qData.get("questionText");
                Object optionsObj = qData.get("options");
                List<String> options;
                if (optionsObj instanceof List<?>) {
                    options = ((List<?>) optionsObj).stream()
                        .map(Object::toString)
                        .collect(Collectors.toList());
                } else {
                    options = null;
                }
                String correctAnswer = (String) qData.get("correctAnswer");
                String explanation = (String) qData.get("explanation");

                if (questionText == null || options == null || options.isEmpty() || correctAnswer == null) {
                    throw new IllegalArgumentException("AI generated question is missing required fields");
                }

                Question question = new Question();
                question.setQuestionText(questionText);
                question.setOptions(options);
                question.setCorrectAnswer(correctAnswer);
                question.setExplanation(explanation);
                question.setTest(test);
                test.getQuestions().add(question);
            }
        } catch (Exception e) {
            log.error("Error parsing AI response", e);
            throw new RuntimeException("Failed to parse generated questions");
        }
        
        test = testRepository.save(test);
        return mapToResponse(test);
    }
    
    public TestResponse getTest(Long id) {
        Test test = testRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Test not found"));
        return mapToResponse(test);
    }
    
    public List<TestResponse> getAllTests() {
        return testRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    private String extractJson(String response) {
        int start = response.indexOf('[');
        int end = response.lastIndexOf(']') + 1;
        if (start >= 0 && end > start) {
            return response.substring(start, end);
        }
        return response;
    }
    
    private TestResponse mapToResponse(Test test) {
        TestResponse response = new TestResponse();
        response.setId(test.getId());
        response.setTopic(test.getTopic());
        response.setQuestionCount(test.getQuestionCount());
        response.setCreatedAt(test.getCreatedAt());
        response.setDifficulty(test.getDifficulty());
        
        List<QuestionResponse> questions = test.getQuestions().stream()
            .map(this::mapQuestionToResponse)
            .collect(Collectors.toList());
        response.setQuestions(questions);
        
        return response;
    }
    
    private QuestionResponse mapQuestionToResponse(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setQuestionText(question.getQuestionText());
        response.setOptions(question.getOptions());
        response.setCorrectAnswer(question.getCorrectAnswer());
        response.setExplanation(question.getExplanation());
        return response;
    }
}
