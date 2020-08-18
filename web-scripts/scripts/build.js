#! /usr/bin/env node

const compile = require('../helpers/compile');
const preparePaths = require('../helpers/prepare-paths');
const createConfig = require('../helpers/create-config');

const paths = preparePaths();
const mode =
  process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';

const clientConfig = createConfig('web', mode, 'build', paths);
const clientCompiler = compile(clientConfig);

clientCompiler.run((err, stats) => {
  if (err) console.log('Failed to compile client', [err]);

  console.log('Done compiling client');

  const serverConfig = createConfig('node', mode, 'build', paths);
  const serverCompiler = compile(serverConfig);

  serverCompiler.run((err, stats) => {
    if (err) console.log('Failed to compile server', [err]);

    console.log('Done compiling server');
  });
});
