const { merge } = require('webpack-merge');
const paths = require('./paths');
const config = require('./create-webpack-config');

const mode = 'development';

module.exports = merge([
  config.setMode(mode),
  config.setEntries({ client: [paths.clientBundleEntry] }),
  config.setOutput(paths.outputDirectory, mode),
  config.resolveExtensions(),
  config.addJSSupport(),
  config.addTSSupport(paths.tsConfigPath),
  config.addCSSSupport(),
  config.startDevServer(),
  config.handleStaticAssetsImport('static/'),
  config.useHTMLTemplate(paths.htmlTemplate),
  config.setHotModuleReplacement()
]);
