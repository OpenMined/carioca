const { merge } = require('webpack-merge');
const config = require('./webpack.config');

const mode = 'development';

module.exports = merge([
  config.setMode(mode),
  config.setEntries(),
  config.setOutput(mode),
  config.resolveExtensions(),
  config.addJSSupport(),
  config.addTSSupport(mode),
  config.addCSSSupport(),
  config.addCSVSupport(),
  config.generateSourceMaps(mode),
  config.handleStaticAssetsImport(),
  config.copyPublic(),
  config.usepublicHTMLTemplate(),
  config.startDevServer(),
]);
