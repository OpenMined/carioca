#! /usr/bin/env node

const fs = require('fs');

const compile = require('../helpers/compile');
const preparePathsHelper = require('../helpers/prepare-paths');
const createConfig = require('../helpers/create-config');

const preparePaths = preparePathsHelper.default;
const resolveApp = preparePathsHelper.resolveApp;
const resolveSelf = preparePathsHelper.resolveSelf;

const paths = preparePaths();
const mode =
  process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';

const clientConfig = createConfig('web', mode, 'build', paths);
const clientCompiler = compile(clientConfig);

clientCompiler.run((err, stats) => {
  if (err) console.log('Failed to compile client', [err]);

  console.log('Done compiling client');

  let indexExisted = true;
  let serverExisted = true;

  // Copy the index.js file from our templates if it doesn't already exist
  if (!fs.existsSync(paths.indexEntry)) {
    indexExisted = false;
    fs.copyFileSync(resolveSelf('templates/src/index.js'), paths.indexEntry);
  }

  // Copy the server.js file from our templates if it doesn't already exist
  if (!fs.existsSync(paths.serverEntry)) {
    serverExisted = false;
    fs.copyFileSync(resolveSelf('templates/src/server.js'), paths.serverEntry);
  }

  const serverConfig = createConfig('node', mode, 'build', paths);
  const serverCompiler = compile(serverConfig);

  serverCompiler.run((err, stats) => {
    if (err) console.log('Failed to compile server', [err]);

    // If the index and server files never previously existed then they must have been temporary
    // Delete them!
    if (!indexExisted) fs.unlinkSync(paths.indexEntry);
    if (!serverExisted) fs.unlinkSync(paths.serverEntry);

    console.log('Done compiling server');
  });
});
