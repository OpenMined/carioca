module.exports = {
  /* CUSTOM JEST HERE */
  preset: 'ts-jest',
  transform: {
    '^.+\\.[jt]sx?$': 'ts-jest'
  },
  moduleDirectories: ['node_modules'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less)$':
      'identity-obj-proxy'
  }
};
