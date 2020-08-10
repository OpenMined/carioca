#! /usr/bin/env node

const compile = require('../helpers/compile');
const preparePaths = require('../helpers/prepare-paths');
const createConfig = require('../helpers/create-config');
const runCommand = require('../helpers/run-command');

const paths = preparePaths();

const clientConfig = createConfig('client', 'production', paths);
const clientCompiler = compile(clientConfig);

clientCompiler.run((err, stats) => {
  if (err) console.log('Failed to compile', [err]);

  console.log('Done compiling.');
});
