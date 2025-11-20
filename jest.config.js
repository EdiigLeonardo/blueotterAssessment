/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.ts$': '$1',
    '^../db/prisma(\\.js)?$': '<rootDir>/spec/mocks/prisma',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.json' }],
  },
  setupFilesAfterEnv: ['<rootDir>/spec/singleton.ts'],
};