const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const nodemon = require('nodemon');

const { error } = require('../log');

module.exports = (serverConfig) => {
  // Define the path of the server bundle
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );

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
  });

  nodemon({ script: bundlePath, watch: [bundlePath] });
};
