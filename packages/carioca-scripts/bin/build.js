#! /usr/bin/env node

const webpack = require('webpack');
const { createConfig, definePaths } = require('@carioca/utils');

// Define a simple compiler function to DRY things up
const compile = (config) => {
  let compiler;

  try {
    compiler = webpack(config);
  } catch (e) {
    console.log('Failed to compile', [e]);
    process.exit(1);
  }

  return compiler;
};

// Determine all of our paths
const paths = definePaths();

// Determine whether or not we're calling build or build:dev
const mode =
  process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';

// Create the client-side Webpack config and put it in the compiler
const clientConfig = createConfig('web', mode, 'build', paths);
const clientCompiler = compile(clientConfig);

// Run the client-side compiler
clientCompiler.run((err) => {
  if (err) console.log('Failed to compile client', [err]);

  console.log('Done compiling client');

  // Create the server-side Webpack config and put it in the compiler
  const serverConfig = createConfig('node', mode, 'build', paths);
  const serverCompiler = compile(serverConfig);

  // Run the server-side compiler
  serverCompiler.run((err) => {
    if (err) console.log('Failed to compile server', [err]);

    console.log('Done compiling server');
  });
});
