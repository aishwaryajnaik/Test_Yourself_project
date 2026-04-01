Feature: Test Generation E2E
  As a user
  I want to generate and take tests
  So that I can learn effectively

  Scenario: User generates a test from topic
    Given I am on the home page
    When I click "Generate Test Now"
    And I enter topic "JavaScript Basics"
    And I select 5 questions
    And I click generate
    Then I should see a test with 5 questions

  Scenario: User takes a test and sees results
    Given I have a generated test
    When I answer all questions
    And I submit the test
    Then I should see my score
    And I should see explanations for each question
