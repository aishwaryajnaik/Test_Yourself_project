Feature: Test Generation
  As a user
  I want to generate tests from topics
  So that I can practice and learn

  Scenario: Generate a test from a topic
    Given I have a topic "Java Programming"
    And I want 5 questions
    When I request test generation
    Then I should receive a test with 5 questions
    And each question should have 4 options

  Scenario: Generate a test with custom difficulty
    Given I have a topic "Python Basics"
    And I want 3 questions with difficulty "easy"
    When I request test generation
    Then I should receive a test with difficulty "easy"
