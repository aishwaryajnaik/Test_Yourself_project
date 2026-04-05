/**
 * API step definitions using Playwright's APIRequestContext.
 * Covers: generate test, get by ID, list all, and error scenarios.
 */

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { request, APIRequestContext, APIResponse } from '@playwright/test';

const BASE_URL = process.env.API_URL ?? 'http://localhost:8080';

let apiContext: APIRequestContext;
let response: APIResponse;
let createdTestId: number;

Before(async function () {
  apiContext = await request.newContext({ baseURL: BASE_URL });
});

After(async function () {
  await apiContext.dispose();
});

// ── Given ────────────────────────────────────────────────────────────────────

Given('the API is available', async function () {
  // Playwright will throw on connection errors — no explicit health check needed
});

Given('I have generated a test for topic {string} with {int} questions', async function (
  topic: string,
  count: number
) {
  const res = await apiContext.post('/api/tests/generate', {
    data: { topic, questionCount: count, difficulty: 'easy' },
  });
  const body = await res.json();
  createdTestId = body.id;
});

// ── When ─────────────────────────────────────────────────────────────────────

When(
  'I send a POST request to {string} with topic {string}, {int} questions and difficulty {string}',
  async function (path: string, topic: string, count: number, difficulty: string) {
    response = await apiContext.post(path, {
      data: { topic, questionCount: count, difficulty },
    });
  }
);

When('I send a GET request to {string}', async function (path: string) {
  // Replace {id} placeholder with the actual created test ID if present
  const resolvedPath = path.replace('{id}', String(createdTestId));
  response = await apiContext.get(resolvedPath);
});

// ── Then ─────────────────────────────────────────────────────────────────────

Then('the response status should be {int}', async function (expectedStatus: number) {
  if (response.status() !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} but got ${response.status()}`);
  }
});

Then('the response should contain topic {string}', async function (topic: string) {
  const body = await response.json();
  if (body.topic !== topic) {
    throw new Error(`Expected topic "${topic}" but got "${body.topic}"`);
  }
});

Then('the response should contain {int} questions', async function (count: number) {
  const body = await response.json();
  if (body.questions?.length !== count) {
    throw new Error(`Expected ${count} questions but got ${body.questions?.length}`);
  }
});

Then('each question should have a questionText, options and correctAnswer', async function () {
  const body = await response.json();
  for (const q of body.questions) {
    if (!q.questionText || !Array.isArray(q.options) || !q.correctAnswer) {
      throw new Error(`Question missing required fields: ${JSON.stringify(q)}`);
    }
  }
});

Then('the response id should match the created test', async function () {
  const body = await response.json();
  if (body.id !== createdTestId) {
    throw new Error(`Expected id ${createdTestId} but got ${body.id}`);
  }
});

Then('the response should have at least 1 question', async function () {
  const body = await response.json();
  if (!body.questions || body.questions.length < 1) {
    throw new Error('Expected at least 1 question in the response');
  }
});

Then('the response should be an array', async function () {
  const body = await response.json();
  if (!Array.isArray(body)) {
    throw new Error(`Expected an array but got ${typeof body}`);
  }
});
