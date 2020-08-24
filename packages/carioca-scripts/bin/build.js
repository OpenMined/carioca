#! /usr/bin/env node

const webpack = require('webpack');
const mri = require('mri');
const {
  createConfig,
  definePaths,
  info,
  error,
  success,
} = require('@carioca/utils');

// Handle compilation errors
const handleErrors = (target, err, stats) => {
  if (err || stats.hasErrors()) {
    if (err) {
      error(`Fatal error when compiling the ${target}`, err.stack || err);

      if (err.details) {
        error('More details...', err.details);
      }

      return;
    }

    if (stats) {
      const info = stats.toJson();

      if (stats.hasErrors()) {
        error(`Error when compiling the ${target}`, info.errors);
      }

      if (stats.hasWarnings()) {
        warning(`Warning when compiling the ${target}`, info.warnings);
      }
    }
  }
};

// Define a simple compiler function to DRY things up
const compile = (config, target) => {
  let compiler;

  try {
    compiler = webpack(config);
  } catch (err) {
    handleErrors(target, err);
    process.exit(1);
  }

  return compiler;
};

const args = mri(process.argv.slice(2));

// Determine what environment we want to build (default to production)
const env = args.e || args.env || 'production';

// Determine what mode we want to build (default to ssr)
const mode = args.m || args.mode || 'ssr';

// Determine the user's desired port (default to 3000)
const port = args.p || args.port || 3000;

// What to call when we're done
const onFinish = () =>
  success(
    `${
      env.charAt(0).toUpperCase() + env.slice(1)
    } ${mode.toUpperCase()} build complete`
  );

// Determine all of our paths
info('Defining the paths to your application...');
const paths = definePaths();

// Create the client-side Webpack config and put it in the compiler
info(`Creating the configuration for the client...`);
const clientConfig = createConfig({
  target: 'web',
  intention: 'build',
  env,
  mode,
  port,
  paths,
});
const clientCompiler = compile(clientConfig, 'client');

// Run the client-side compiler
clientCompiler.run((err, stats) => {
  handleErrors('client', err, stats);

  success('Done compiling client!');

  if (mode === 'spa') onFinish();
  else {
    // Create the server-side Webpack config and put it in the compiler
    info(`Creating the configuration for the server...`);
    const serverConfig = createConfig({
      target: 'node',
      intention: 'build',
      env,
      mode,
      port,
      paths,
    });
    const serverCompiler = compile(serverConfig, 'server');

    // Run the server-side compiler
    serverCompiler.run((err, stats) => {
      handleErrors('client', err, stats);

      success('Done compiling server!');
      onFinish();
    });
  }
});
