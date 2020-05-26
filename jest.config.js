module.exports = {
  rootDir: '.',
  roots: [
    '<rootDir>/test',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts)',
    '**/?(*.)+(test).+(ts)'
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  }
};

