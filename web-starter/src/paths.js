const path = require('path');

const appRoot = path.resolve(process.cwd());

module.exports = {
  appRoot,
  htmlTemplate: path.join(appRoot, 'public/index.html'),
  clientBundleEntry: path.join(appRoot, 'src/index.js'),
  outputDirectory: path.join(appRoot, 'dist/'),
};
