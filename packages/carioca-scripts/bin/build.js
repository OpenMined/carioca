#! /usr/bin/env node

const webpack = require('webpack');
const { createConfig, definePaths } = require('@carioca/utils');

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

const paths = definePaths();
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
