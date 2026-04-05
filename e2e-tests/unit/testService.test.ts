/**
 * Unit tests for TestService logic (TypeScript equivalent of TestServiceTest.java)
 * Tests the question parsing and response mapping in isolation using mocks.
 */

// Types mirroring backend DTOs
interface QuestionResponse {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface TestResponse {
  id: number;
  topic: string;
  questionCount: number;
  difficulty: string;
  questions: QuestionResponse[];
}

// Minimal in-process replica of TestService's core logic
function parseAIResponse(aiJson: string): QuestionResponse[] {
  const start = aiJson.indexOf('[');
  const end = aiJson.lastIndexOf(']') + 1;
  const clean = start >= 0 && end > start ? aiJson.substring(start, end) : aiJson;
  const raw: Array<Record<string, unknown>> = JSON.parse(clean);

  return raw.map((q, i) => {
    if (!q['questionText'] || !q['options'] || !q['correctAnswer']) {
      throw new Error(`Question at index ${i} is missing required fields`);
    }
    return {
      id: i + 1,
      questionText: q['questionText'] as string,
      options: q['options'] as string[],
      correctAnswer: q['correctAnswer'] as string,
      explanation: (q['explanation'] as string) ?? '',
    };
  });
}

function buildTestResponse(id: number, topic: string, difficulty: string, questions: QuestionResponse[]): TestResponse {
  return { id, topic, questionCount: questions.length, difficulty, questions };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('TestService — unit', () => {
  const mockAiResponse = JSON.stringify([
    {
      questionText: 'What is Java?',
      options: ['A language', 'A framework', 'A database', 'An OS'],
      correctAnswer: 'A language',
      explanation: 'Java is a programming language',
    },
    {
      questionText: 'What is JVM?',
      options: ['Virtual Machine', 'A library', 'A framework', 'A compiler'],
      correctAnswer: 'Virtual Machine',
      explanation: 'JVM runs Java bytecode',
    },
  ]);

  test('parses AI response into questions correctly', () => {
    const questions = parseAIResponse(mockAiResponse);
    expect(questions).toHaveLength(2);
    expect(questions[0].questionText).toBe('What is Java?');
    expect(questions[0].options).toHaveLength(4);
    expect(questions[0].correctAnswer).toBe('A language');
  });

  test('builds test response with correct metadata', () => {
    const questions = parseAIResponse(mockAiResponse);
    const response = buildTestResponse(1, 'Java Programming', 'medium', questions);
    expect(response.topic).toBe('Java Programming');
    expect(response.difficulty).toBe('medium');
    expect(response.questionCount).toBe(2);
  });

  test('extracts JSON when AI response has extra text around it', () => {
    const wrapped = `Here are your questions: ${mockAiResponse} Hope that helps!`;
    const questions = parseAIResponse(wrapped);
    expect(questions).toHaveLength(2);
  });

  test('throws when a question is missing required fields', () => {
    const bad = JSON.stringify([{ questionText: 'Incomplete?' }]);
    expect(() => parseAIResponse(bad)).toThrow('missing required fields');
  });
});
