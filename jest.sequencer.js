const TestSequencer = require('@jest/test-sequencer').default;

const ORDER_PATH = [
  'unit',
  'integration'
];

class CustomSequencer extends TestSequencer {
  sort(tests) {
    return tests.sort((testA, testB) => {
      const indexA = ORDER_PATH.indexOf(testA.path);
      const indexB = ORDER_PATH.indexOf(testB.path);

      if (indexA === indexB) return 0; // do not swap when tests both not specify in order.

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA < indexB ? -1 : 1;
    });
  }
}

module.exports = CustomSequencer;

