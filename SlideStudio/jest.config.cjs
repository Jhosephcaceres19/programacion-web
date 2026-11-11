module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },

  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],

  testMatch: [
    '**/src/tests/**/*.test.ts',
    '**/src/tests/**/*.test.tsx',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  clearMocks: true,
  restoreMocks: true,
};