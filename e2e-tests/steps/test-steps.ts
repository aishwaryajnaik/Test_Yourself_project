import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';

let browser: Browser;
let page: Page;

Given('I am on the home page', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
});

When('I click {string}', async function (buttonText: string) {
  await page.click(`text=${buttonText}`);
});

When('I enter topic {string}', async function (topic: string) {
  await page.fill('input[placeholder*="Java"]', topic);
});

When('I select {int} questions', async function (count: number) {
  await page.fill('input[type="number"]', count.toString());
});

When('I click generate', async function () {
  await page.click('button[type="submit"]');
});

Then('I should see a test with {int} questions', async function (count: number) {
  await page.waitForSelector('.question-card');
  const questions = await page.$$('.question-card');
  if (questions.length !== count) {
    throw new Error(`Expected ${count} questions but found ${questions.length}`);
  }
});

Given('I have a generated test', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:3000/test/1');
});

When('I answer all questions', async function () {
  const questions = await page.$$('.question-card');
  for (let i = 0; i < questions.length; i++) {
    await page.click(`.question-card:nth-child(${i + 1}) .option:first-child input`);
  }
});

When('I submit the test', async function () {
  await page.click('text=Submit Test');
});

Then('I should see my score', async function () {
  await page.waitForSelector('.score-card');
});

Then('I should see explanations for each question', async function () {
  const explanations = await page.$$('.explanation');
  if (explanations.length === 0) {
    throw new Error('No explanations found');
  }
  await browser.close();
});
