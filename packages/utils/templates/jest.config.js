module.exports = {
  /* CUSTOM JEST HERE */
  transform: {
    '^.+\\.[t|j]sx?$': ['babel-jest', { configFile: null }]
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less)$':
      'identity-obj-proxy'
  }
};
