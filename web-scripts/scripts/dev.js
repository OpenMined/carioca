#! /usr/bin/env node

const webpack = require('webpack');
const DevServer = require('webpack-dev-server');

const preparePaths = require('../helpers/prepare-paths');
const createConfig = require('../helpers/create-config');
const runCommand = require('../helpers/run-command');

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

const clientConfig = createConfig('development', paths);
const clientCompiler = compile(clientConfig);
const clientDevServer = new DevServer(clientCompiler);

clientDevServer.listen(clientConfig.devServer.port, (err) => {
  if (err) console.log('Failed to listen', [err]);
});
