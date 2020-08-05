const { merge } = require('webpack-merge');
const PATHS = require('./paths');
const parts = require('./create-webpack-config');

const devConfig = merge([
  parts.setDevMode(),
  parts.setEntries({
    client: ['@babel/polyfill', PATHS.clientBundleEntry],
  }),
  parts.setOutput(PATHS.outputDirectory),
  parts.startDevServer(),
  parts.resolveExtensions(['.js', '.jsx']),
  parts.transpileJavaScript(),
  parts.transpileCSS(),
  parts.handleStaticAssetsImport('static/'),
  parts.useHTMLTemplate(PATHS.htmlTemplate),
  parts.setHotModuleReplacement(),
]);

module.exports = devConfig;
