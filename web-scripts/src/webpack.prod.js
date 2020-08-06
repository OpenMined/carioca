const { merge } = require('webpack-merge');
const config = require('./webpack.config');

const mode = 'production';

module.exports = merge([
  config.setMode(mode),
  config.setEntries(),
  config.setOutput(mode),
  config.resolveExtensions(),
  config.addJSSupport(),
  config.addTSSupport(),
  config.addCSSSupport(),
  config.addCSVSupport(),
  config.generateSourceMaps(mode),
  config.handleStaticAssetsImport(),
  config.setPeerDepsAsExternals(),
  config.cleanDirectory(),
  config.copyPublic(),
  config.useHTMLTemplate(),
  config.createChunks()
]);
