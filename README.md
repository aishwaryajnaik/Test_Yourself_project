# Test Yourself - AI-Based Test Generation Platform

An intelligent web application that dynamically generates quizzes and tests using Natural Language Processing from user-provided topics and documents.

## Features

- Dynamic quiz generation from topics and documents
- NLP-powered question generation
- REST API with Spring Boot
- Automated testing with Playwright and Cucumber BDD
- Modern React frontend
- PostgreSQL database

## Tech Stack

- Backend: Spring Boot 3.x, Java 17
- Frontend: React 18, TypeScript
- Database: PostgreSQL
- AI/NLP: OpenAI API integration
- Testing: JUnit, Playwright, Cucumber
- Build: Maven

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Documentation

API runs on `http://localhost:8080`
Frontend runs on `http://localhost:3000`

## Testing

```bash
# Backend tests
cd backend
mvn test

# E2E tests
cd e2e-tests
npm test
```

## License

MIT

