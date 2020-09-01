const { definePaths, runCommand } = require('@carioca/utils');

module.exports = (args) => {
  // Determine our paths
  const paths = definePaths();

  // Run the jest test suite with our jest config and all the optional flags the user provided
  runCommand('jest', ['--config', paths.jestConfigPath, ...args]);
};
