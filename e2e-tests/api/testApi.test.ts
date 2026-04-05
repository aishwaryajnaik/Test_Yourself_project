/**
 * API integration tests — hits the live backend at localhost:8080
 * Validates REST endpoints: status codes, response shape, error handling.
 * Run with the backend + DB up (docker-compose up postgres backend).
 */

import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.API_URL ?? 'http://localhost:8080/api/tests';

describe('POST /api/tests/generate', () => {
  test('returns 200 with questions for a valid request', async () => {
    const res = await axios.post(BASE_URL + '/generate', {
      topic: 'JavaScript Basics',
      questionCount: 3,
      difficulty: 'easy',
    });

    expect(res.status).toBe(200);
    expect(res.data.topic).toBe('JavaScript Basics');
    expect(res.data.questions).toHaveLength(3);
    expect(res.data.questions[0]).toMatchObject({
      questionText: expect.any(String),
      options: expect.arrayContaining([expect.any(String)]),
      correctAnswer: expect.any(String),
    });
  });

  test('returns 400 when topic is blank', async () => {
    try {
      await axios.post(BASE_URL + '/generate', { topic: '', questionCount: 5 });
      fail('Expected 400 error');
    } catch (err) {
      const e = err as AxiosError;
      expect(e.response?.status).toBe(400);
    }
  });

  test('returns 400 when questionCount exceeds 50', async () => {
    try {
      await axios.post(BASE_URL + '/generate', { topic: 'Java', questionCount: 100 });
      fail('Expected 400 error');
    } catch (err) {
      const e = err as AxiosError;
      expect(e.response?.status).toBe(400);
    }
  });
});

describe('GET /api/tests/:id', () => {
  let createdId: number;

  beforeAll(async () => {
    const res = await axios.post(BASE_URL + '/generate', {
      topic: 'Python',
      questionCount: 2,
      difficulty: 'easy',
    });
    createdId = res.data.id;
  });

  test('returns the test by id', async () => {
    const res = await axios.get(`${BASE_URL}/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(createdId);
    expect(res.data.questions.length).toBeGreaterThan(0);
  });

  test('returns 404 for non-existent id', async () => {
    try {
      await axios.get(`${BASE_URL}/999999`);
      fail('Expected 404 error');
    } catch (err) {
      const e = err as AxiosError;
      expect(e.response?.status).toBe(404);
    }
  });
});

describe('GET /api/tests', () => {
  test('returns an array of tests', async () => {
    const res = await axios.get(BASE_URL);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });
});
