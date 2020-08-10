#! /usr/bin/env node

const DevServer = require('webpack-dev-server');

const compile = require('../helpers/compile');
const preparePaths = require('../helpers/prepare-paths');
const createConfig = require('../helpers/create-config');
const runCommand = require('../helpers/run-command');

const paths = preparePaths();

const clientConfig = createConfig('client', 'development', paths);
const clientCompiler = compile(clientConfig);
const clientDevServer = new DevServer(clientCompiler);

clientDevServer.listen(clientConfig.devServer.port, (err) => {
  if (err) console.log('Failed to listen', [err]);
});
