import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/unit/**/*.test.ts', '**/api/**/*.test.ts'],
};

export default config;
