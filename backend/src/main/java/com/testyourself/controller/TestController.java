package com.testyourself.controller;

import com.testyourself.dto.TestGenerationRequest;
import com.testyourself.dto.TestResponse;
import com.testyourself.service.TestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestController {
    
    private final TestService testService;
    
    @PostMapping("/generate")
    public ResponseEntity<TestResponse> generateTest(@Valid @RequestBody TestGenerationRequest request) {
        TestResponse response = testService.generateTest(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TestResponse> getTest(@PathVariable Long id) {
        TestResponse response = testService.getTest(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<TestResponse>> getAllTests() {
        List<TestResponse> tests = testService.getAllTests();
        return ResponseEntity.ok(tests);
    }

    @GetMapping("/home")
    public String home() {
        return "hello from back end";
    }

}
