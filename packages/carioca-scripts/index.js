#!/usr/bin/env node

// Require sade
const sade = require('sade');

// Require a helpful script for running commands
const { runCommand } = require('@carioca/utils');

// Require our package.json file
const pkg = require('./package.json');

// Define the sade script
const prog = sade('carioca');

// Add the version information to our sade CLI
prog.version(pkg.version);

// Add the build script
prog
  .command('build')
  .describe('Build the application')
  .option(
    '-e --env',
    'The environment you want to build (production or development)',
    'production'
  )
  .option('-m --mode', 'The mode you want to build as (ssr or spa)', 'ssr')
  .option('-p --port', 'The port where you want your application to run', 3000)
  .example('build --env development')
  .example('build --mode spa')
  .example('build --port 8000')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/build')].concat(process.argv.slice(3))
    );
  });

// Add the start script
prog
  .command('start')
  .describe('Run the built application - make sure to build first!')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/start')].concat(process.argv.slice(3))
    );
  });

// Add the development script (live-reload)
prog
  .command('dev')
  .describe('Start the application in development mode')
  .option('-m --mode', 'The mode you want to build as (ssr or spa)', 'ssr')
  .option('-p --port', 'The port where you want your application to run', 3000)
  .example('dev --mode spa')
  .example('dev --port 8000')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/dev')].concat(process.argv.slice(3))
    );
  });

// Add the test script
prog
  .command('test')
  .describe('Runs the test suite (supports all Jest CLI flags)')
  .example('test --watch')
  .example('test --coverage')
  .example('test --passWithNoTests --verbose')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/test')].concat(process.argv.slice(3))
    );
  });

// Tell our CLI to parse the arguments it's given and we're off to the races!
prog.parse(process.argv);
