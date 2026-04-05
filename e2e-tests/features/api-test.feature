Feature: Test Generation API
  As a developer
  I want to validate the REST API endpoints
  So that I can ensure the backend behaves correctly

  Scenario: Generate a test with valid input
    Given the API is available
    When I send a POST request to "/api/tests/generate" with topic "JavaScript Basics", 3 questions and difficulty "easy"
    Then the response status should be 200
    And the response should contain topic "JavaScript Basics"
    And the response should contain 3 questions
    And each question should have a questionText, options and correctAnswer

  Scenario: Generate a test with blank topic returns 400
    Given the API is available
    When I send a POST request to "/api/tests/generate" with topic "", 5 questions and difficulty "easy"
    Then the response status should be 400

  Scenario: Generate a test with question count exceeding 50 returns 400
    Given the API is available
    When I send a POST request to "/api/tests/generate" with topic "Java", 100 questions and difficulty "easy"
    Then the response status should be 400

  Scenario: Retrieve a previously generated test by ID
    Given the API is available
    And I have generated a test for topic "Python" with 2 questions
    When I send a GET request to "/api/tests/{id}"
    Then the response status should be 200
    And the response id should match the created test
    And the response should have at least 1 question

  Scenario: Retrieve a non-existent test returns 404
    Given the API is available
    When I send a GET request to "/api/tests/999999"
    Then the response status should be 404

  Scenario: List all tests returns an array
    Given the API is available
    When I send a GET request to "/api/tests"
    Then the response status should be 200
    And the response should be an array
