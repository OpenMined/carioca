#!/usr/bin/env node

const sade = require('sade');
const runCommand = require('./helpers/run-command');
const pkg = require('./package.json');
const prog = sade('om-web-scripts');

prog.version(pkg.version);

prog
  .command('build')
  .describe('Build the application in production mode.')
  .option(
    '-t, --type',
    'Change the application build type. Must be either `iso` or `spa`.',
    'iso'
  )
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./scripts/build')].concat(process.argv.slice(3))
    );
  });

prog
  .command('dev')
  .describe('Start the application in development mode.')
  .option(
    '-t, --type',
    'Change the application build type. Must be either `iso` or `spa`.',
    'iso'
  )
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./scripts/dev')].concat(process.argv.slice(3))
    );
  });

prog
  .command('test')
  .describe('Runs the test suite (supports all Jest CLI flags).')
  .example('test --watch')
  .example('test --coverage')
  .example('test --passWithNoTests --verbose')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./scripts/test')].concat(process.argv.slice(3))
    );
  });

// prog
//   .version('1.0.5')
//   .option('--global, -g', 'An example global flag')
//   .option('-c, --config', 'Provide path to custom config', 'foo.config.js');

// prog
//   .command('build <src> <dest>')
//   .describe('Build the source directory. Expects an `index.js` entry file.')
//   .option('-o, --output', 'Change the name of the output file', 'bundle.js')
//   .example('build src build --global --config my-conf.js')
//   .example('build app public -o main.js')
//   .action((src, dest, opts) => {
//     console.log(`> building from ${src} to ${dest}`);
//     console.log('> these are extra opts', opts);
//   });

prog.parse(process.argv);
