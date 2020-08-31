#!/usr/bin/env node

// Require commander
const { program } = require('commander');

// Require our package.json file
const pkg = require('./package.json');

const build = require('./bin/build');
const start = require('./bin/start');
const dev = require('./bin/dev');
const test = require('./bin/test');

// Define the commander script
program.version(pkg.version);

// Add the build script
program
  .command('build')
  .description('Build the application')
  .option(
    '-e --env <type>',
    'The environment you want to build (production or development)',
    'production'
  )
  .option('-m --mode <type>', 'The mode you want to build as (ssr or spa)', 'ssr')
  .option('-p --port <number>', 'The port where you want your application to run', 3000)
  .action(({ env, mode, port }) => build(env, mode, port));

// Add the start script
program
  .command('start')
  .description('Run the built application - make sure to build first!')
  .action(start);

// Add the development script (live-reload)
program
  .command('dev')
  .description('Start the application in development mode')
  .option('-m --mode <type>', 'The mode you want to build as (ssr or spa)', 'ssr')
  .option('-p --port <number>', 'The port where you want your application to run', 3000)
  .action(({ mode, port }) => dev(mode, port));

// Add the test script
program
  .command('test')
  .description('Runs the test suite (supports all Jest CLI flags)')
  .allowUnknownOption()
  .action(({ args }) => test(args));

// Tell our CLI to parse the arguments it's given and we're off to the races!
program.parse(process.argv);
