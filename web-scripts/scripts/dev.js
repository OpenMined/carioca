#! /usr/bin/env node

const DevServer = require('webpack-dev-server');

const compile = require('../helpers/compile');
const preparePaths = require('../helpers/prepare-paths').default;
const createConfig = require('../helpers/create-config');

const paths = preparePaths();

const clientConfig = createConfig('web', 'development', 'run', paths);
const clientCompiler = compile(clientConfig);
const clientDevServer = new DevServer(clientCompiler);

const serverConfig = createConfig('node', 'development', 'run', paths);
const serverCompiler = compile(serverConfig);

clientCompiler.hooks.done.tap('clientCompiler', (clientStats) => {
  console.log('Done compiling client');

  const serverDevServer = serverCompiler.watch({}, (serverStats) => {
    console.log('Done compiling server');
  });
});

clientDevServer.listen(clientConfig.devServer.port, (err) => {
  if (err) console.log('Failed to listen', [err]);
});
