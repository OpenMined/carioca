const { merge } = require('webpack-merge');
const PATHS = require('./paths');
const parts = require('./create-webpack-config');

const productionConfig = merge([
  parts.setProductionMode(),
  parts.setEntries({
    client: ['@babel/polyfill', PATHS.clientBundleEntry],
  }),
  parts.setOutput(PATHS.outputDirectory, true),
  parts.cleanDirectory(PATHS.outputDirectory, PATHS.appRoot),
  parts.createVendorChunk(['@babel/polyfill|react|react-dom']),
  parts.resolveExtensions(['.js', '.jsx']),
  parts.handleStaticAssetsImport('static/'),
  parts.useHTMLTemplate(PATHS.htmlTemplate),
  parts.transpileJavaScript(),
  parts.transpileCSS(),
]);

module.exports = productionConfig;
