module.exports = {
  preset: 'jest-playwright-preset',
  testEnvironmentOptions: {
    'jest-playwright': {
      browsers: ['firefox'],
      launchOptions: {
        headless: false,
      },
    },
  },
  setupFilesAfterEnv: ["expect-playwright"],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  testTimeout: 60000,
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  }, // Adjust this value based on the expected duration of your tests
};

