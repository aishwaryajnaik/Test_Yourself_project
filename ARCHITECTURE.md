# Test Yourself Platform - Architecture & Testing Guide

## 🎯 How Your Application Works (Simple Explanation)

Think of your application like a smart teacher assistant:

1. **User Input**: You tell the app "I want to learn about Java" and how many questions you want
2. **AI Processing**: The app asks ChatGPT (OpenAI) to create quiz questions about Java
3. **Storage**: Questions are saved in a database so you can take the test later
4. **Test Taking**: You answer the questions one by one
5. **Results**: The app checks your answers and shows you the score with explanations

### Real-World Example:
```
Student → "Generate 5 questions about Python" 
       → Backend calls OpenAI API
       → OpenAI returns 5 Python questions
       → Backend saves to database
       → Student takes the test
       → System calculates score: 4/5 (80%)
```

---

## 🏗️ Architecture Overview

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  - User Interface (forms, buttons, test display)            │
│  - Runs in browser on port 3000                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Requests (REST API calls)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Spring Boot)                       │
│  - REST API Controllers (receive requests)                  │
│  - Service Layer (business logic)                           │
│  - AI Service (talks to OpenAI)                             │
│  - Runs on port 8080                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL Queries
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                       │
│  - Stores tests and questions                               │
│  - Runs on port 5432                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 API Flow Examples

### Flow 1: Generate Test

```
1. User fills form:
   - Topic: "JavaScript"
   - Questions: 10
   - Difficulty: "medium"

2. Frontend → POST /api/tests/generate
   Body: {
     "topic": "JavaScript",
     "questionCount": 10,
     "difficulty": "medium"
   }

3. Backend Controller receives request
   ↓
4. TestService.generateTest() is called
   ↓
5. AIService calls OpenAI API:
   "Generate 10 medium difficulty JavaScript questions"
   ↓
6. OpenAI returns JSON with questions
   ↓
7. Backend parses and saves to database
   ↓
8. Backend returns test with ID
   Response: {
     "id": 123,
     "topic": "JavaScript",
     "questions": [...]
   }
   ↓
9. Frontend redirects to /test/123
```

### Flow 2: Take Test

```
1. User visits /test/123

2. Frontend → GET /api/tests/123

3. Backend fetches test from database

4. Backend returns test data
   Response: {
     "id": 123,
     "questions": [
       {
         "questionText": "What is a closure?",
         "options": ["A", "B", "C", "D"],
         "correctAnswer": "A"
       }
     ]
   }

5. Frontend displays questions

6. User selects answers and clicks Submit

7. Frontend calculates score locally
   (No API call needed - answers already in response)

8. Shows results with explanations
```

---

## 🧪 Testing Strategy (SDET Approach)

### 1. Unit Testing (Backend)

**What**: Test individual components in isolation

**Example Test**: TestServiceTest.java
```java
@Test
void testGenerateTest() {
    // ARRANGE: Set up test data
    TestGenerationRequest request = new TestGenerationRequest();
    request.setTopic("Java Programming");
    request.setQuestionCount(5);
    
    // Mock AI response
    when(aiService.generateQuestions(...))
        .thenReturn("[{\"questionText\":\"What is Java?\"}]");
    
    // ACT: Call the method
    TestResponse response = testService.generateTest(request);
    
    // ASSERT: Verify results
    assertEquals("Java Programming", response.getTopic());
    assertEquals(5, response.getQuestionCount());
}
```

**Why**: Ensures each function works correctly before integration

---

### 2. BDD Testing (Cucumber)

**What**: Test business scenarios in plain English

**Example Scenario**: test-generation.feature
```gherkin
Scenario: Generate a test from a topic
  Given I have a topic "Java Programming"
  And I want 5 questions
  When I request test generation
  Then I should receive a test with 5 questions
  And each question should have 4 options
```

**Step Implementation**:
```java
@Given("I have a topic {string}")
public void i_have_a_topic(String topic) {
    this.topic = topic;
}

@When("I request test generation")
public void i_request_test_generation() {
    response = restTemplate.postForEntity(
        "/api/tests/generate",
        request,
        TestResponse.class
    );
}

@Then("I should receive a test with {int} questions")
public void i_should_receive_test_with_questions(int count) {
    assertEquals(count, response.getBody().getQuestions().size());
}
```

**Why**: Non-technical stakeholders can understand test cases

---

### 3. E2E Testing (Playwright)

**What**: Test complete user journeys through the UI

**Example Test**: test-steps.ts
```typescript
Scenario: User generates and takes a test

Given('I am on the home page', async () => {
  await page.goto('http://localhost:3000');
});

When('I click Generate Test Now', async () => {
  await page.click('text=Generate Test Now');
});

When('I enter topic "JavaScript"', async () => {
  await page.fill('input[placeholder*="topic"]', 'JavaScript');
});

When('I select 5 questions', async () => {
  await page.fill('input[type="number"]', '5');
});

When('I click generate', async () => {
  await page.click('button[type="submit"]');
  await page.waitForURL('**/test/**');
});

Then('I should see 5 questions', async () => {
  const questions = await page.$$('.question-card');
  expect(questions.length).toBe(5);
});
```

**Why**: Validates the entire system works from user perspective

---

## 📊 API Testing Examples

### Manual API Testing (Postman/cURL)

**Test 1: Generate Test**
```bash
curl -X POST http://localhost:8080/api/tests/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Python Basics",
    "questionCount": 3,
    "difficulty": "easy"
  }'

Expected Response: 201 Created
{
  "id": 1,
  "topic": "Python Basics",
  "questionCount": 3,
  "questions": [...]
}
```

**Test 2: Get Test by ID**
```bash
curl http://localhost:8080/api/tests/1

Expected Response: 200 OK
{
  "id": 1,
  "topic": "Python Basics",
  "questions": [...]
}
```

**Test 3: Invalid Request**
```bash
curl -X POST http://localhost:8080/api/tests/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "",
    "questionCount": 100
  }'

Expected Response: 400 Bad Request
{
  "errors": [
    "Topic is required",
    "Maximum 50 questions allowed"
  ]
}
```

---

## 🔄 SDLC Integration

### Phase 1: Requirements
- **Document**: User stories and acceptance criteria
- **Example**: "As a student, I want to generate tests from topics so I can practice"

### Phase 2: Design
- **Document**: API contracts, database schema
- **Deliverable**: Architecture diagrams (see above)

### Phase 3: Development
- **Backend**: Spring Boot REST APIs
- **Frontend**: React components
- **Integration**: OpenAI API

### Phase 4: Testing (SDET Focus)

#### Test Pyramid
```
        /\
       /E2E\          ← Few tests, slow, expensive
      /------\
     /  API  \        ← More tests, faster
    /----------\
   /   Unit     \     ← Many tests, fast, cheap
  /--------------\
```

**Unit Tests** (70%):
- Test individual methods
- Fast execution (milliseconds)
- Run on every code change
- Example: TestServiceTest.java

**Integration/API Tests** (20%):
- Test API endpoints
- Medium speed (seconds)
- Run before deployment
- Example: Cucumber scenarios

**E2E Tests** (10%):
- Test full user flows
- Slow (minutes)
- Run before release
- Example: Playwright tests

### Phase 5: Deployment
- **CI/CD Pipeline**: GitHub Actions
- **Automated**: Tests run on every commit
- **Quality Gates**: Must pass all tests to deploy

### Phase 6: Maintenance
- **Monitoring**: Track API errors
- **Regression Testing**: Re-run tests after changes

---

## 🎯 SDET Best Practices Applied

### 1. Test Automation Framework
✅ **Implemented**:
- JUnit for unit tests
- Cucumber for BDD
- Playwright for E2E
- GitHub Actions for CI/CD

### 2. Test Data Management
✅ **Implemented**:
- Mock data in unit tests
- Test database for integration tests
- Fixtures for E2E tests

### 3. API Testing
✅ **Implemented**:
- REST API validation
- Request/response verification
- Error handling tests
- Status code validation

### 4. Continuous Testing
✅ **Implemented**:
```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    - Run unit tests
    - Run integration tests
    - Run E2E tests
    - Generate reports
```

### 5. Test Reporting
✅ **Implemented**:
- JUnit XML reports
- Cucumber HTML reports
- Playwright test results
- Coverage reports

---

## 📈 Testing Metrics

### Coverage Goals
- **Unit Test Coverage**: 80%+
- **API Coverage**: 100% of endpoints
- **E2E Coverage**: Critical user paths

### Quality Metrics
- **Pass Rate**: 95%+
- **Execution Time**: < 5 minutes
- **Defect Detection**: Before production

---

## 🚀 Running Tests

### All Tests
```bash
# Backend unit tests
cd backend
mvn test

# E2E tests
cd e2e-tests
npm test

# CI/CD (automatic)
git push → GitHub Actions runs all tests
```

### Specific Test Suites
```bash
# Only unit tests
mvn test -Dtest=TestServiceTest

# Only BDD tests
mvn test -Dcucumber.filter.tags="@smoke"

# Only E2E for one feature
npm test -- --grep "Generate test"
```

---

## 📝 Summary

Your application follows industry-standard SDET practices:

1. **Layered Architecture**: Separation of concerns
2. **Comprehensive Testing**: Unit → Integration → E2E
3. **BDD Approach**: Business-readable test scenarios
4. **API Testing**: Full endpoint coverage
5. **CI/CD Integration**: Automated quality gates
6. **Test Pyramid**: Balanced test distribution

This ensures high quality, maintainability, and confidence in deployments.
