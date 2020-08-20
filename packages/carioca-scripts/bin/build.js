#! /usr/bin/env node

const fs = require('fs');
const webpack = require('webpack');

const preparePathsHelper = require('../scripts/prepare-paths');
const createConfig = require('../scripts/create-config');

const preparePaths = preparePathsHelper.default;
const resolveApp = preparePathsHelper.resolveApp;
const resolveSelf = preparePathsHelper.resolveSelf;

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

const paths = preparePaths();
const mode =
  process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';

const clientConfig = createConfig('web', mode, 'build', paths);
const clientCompiler = compile(clientConfig);

clientCompiler.run((err, stats) => {
  if (err) console.log('Failed to compile client', [err]);

  console.log('Done compiling client');

  let serverExisted = true;

  // Copy the server.js file from our templates if it doesn't already exist
  if (!fs.existsSync(paths.serverEntry)) {
    serverExisted = false;
    fs.copyFileSync(resolveSelf('templates/src/server.js'), paths.serverEntry);
  }

  const serverConfig = createConfig('node', mode, 'build', paths);
  const serverCompiler = compile(serverConfig);

  serverCompiler.run((err, stats) => {
    if (err) console.log('Failed to compile server', [err]);

    // If the server file never previously existed then it must have been temporary - delete it!
    if (!serverExisted) fs.unlinkSync(paths.serverEntry);

    console.log('Done compiling server');
  });
});
