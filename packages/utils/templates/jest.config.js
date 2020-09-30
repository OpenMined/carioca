const { jsWithTs: tsjPreset } = require('ts-jest/presets');

module.exports = {
  /* CUSTOM JEST HERE */
  preset: 'ts-jest/presets/js-with-ts',
  transform: {
    ...tsjPreset.transform
  },
  moduleDirectories: ['node_modules'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less)$':
      'identity-obj-proxy'
  }
};
