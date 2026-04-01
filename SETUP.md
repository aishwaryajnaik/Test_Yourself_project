# Setup Guide - Test Yourself Platform

## Quick Start

### 1. Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Maven 3.8+
- OpenAI API key

### 2. Database Setup

```bash
# Install PostgreSQL (if not installed)
# Windows: Download from https://www.postgresql.org/download/windows/

# Create database
psql -U postgres
CREATE DATABASE testyourself;
\q
```

### 3. Backend Setup

```bash
cd backend

# Configure application
# Copy application.yml and set your OpenAI API key
# Or set environment variable:
set OPENAI_API_KEY=your_key_here

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will start on http://localhost:8080

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will start on http://localhost:3000

### 5. Run Tests

```bash
# Backend tests
cd backend
mvn test

# E2E tests (requires backend and frontend running)
cd e2e-tests
npm install
npm test
```

## Docker Setup (Alternative)

```bash
# Set your OpenAI API key
set OPENAI_API_KEY=your_key_here

# Start all services
docker-compose up -d
```

## API Endpoints

- POST /api/tests/generate - Generate new test
- GET /api/tests/{id} - Get test by ID
- GET /api/tests - Get all tests

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check credentials in application.yml
- Verify database exists

### OpenAI API Issues
- Verify API key is set correctly
- Check API quota and billing
- Ensure internet connectivity

### Port Conflicts
- Backend: Change server.port in application.yml
- Frontend: Set PORT environment variable

## GitHub Integration

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit: AI Test Generation Platform"
git branch -M main
git remote add origin https://github.com/aishwaryajnaikGenerate/test-yourself.git
git push -u origin main
```

### Continuous Integration
The project includes GitHub Actions workflows for:
- Automated testing
- Build verification
- Deployment pipelines

## Next Steps

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Configure the application with your API key
3. Start the backend and frontend
4. Navigate to http://localhost:3000
5. Generate your first test!

## Support

For issues or questions, please open an issue on GitHub.
