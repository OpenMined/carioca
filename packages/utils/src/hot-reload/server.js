const { join } = require('path');
const webpack = require('webpack');
const clearModule = require('clear-module');
const NodemonPlugin = require('nodemon-webpack-plugin');

const { error } = require('../log');

module.exports = (serverConfig) => {
  // Define the path of the server bundle
  const bundlePath = join(
    serverConfig.output.path,
    serverConfig.output.filename
  );

  // Add Nodemon to the serverConfig
  if (!serverConfig.plugins) serverConfig.plugins = [new NodemonPlugin()];
  else serverConfig.plugins.push(new NodemonPlugin());

  // Create a new Webpack compiler for the server
  const compiler = webpack(serverConfig);

  // Define some configuration options for that compiler
  const options = {
    aggregateTimeout: 300, // Wait this long for more changes
    poll: true, // Use polling instead of native watchers
  };

  // Start the compiler and watch for any file changes
  compiler.watch(options, (err) => {
    // If we have a compilation error
    if (err) {
      error('Error bundling server', err);
      return;
    }

    // Each time we have new files, we should destroy the cached bundle
    clearModule(bundlePath);
  });
};
