const path = require('path');

const appRoot = path.resolve(process.cwd());

module.exports = {
  appRoot,
  htmlTemplate: path.join(appRoot, 'public/index.html'),
  // clientDirectory: path.join(appRoot, 'src'),
  tsConfigPath: path.join(appRoot, 'tsconfig.json'),
  clientBundleEntry: path.join(appRoot, 'src/index.js'),
  outputDirectory: path.join(appRoot, 'dist')
};
