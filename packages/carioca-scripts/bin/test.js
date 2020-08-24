#! /usr/bin/env node

const mri = require('mri');
const { definePaths, runCommand } = require('@carioca/utils');

// Get the arguments that the user input and parse them with mri
const args = mri(process.argv.slice(2));
const other = [];

// Nonsense args that we don't need...
delete args._;

// For each of the arguments, turn them into flags
Object.entries(args).forEach((a) => {
  if (a[1] === true) other.push(`--${a[0]}`);
  else other.push(`--${a[0]}=${a[1]}`);
});

// Determine our paths
const paths = definePaths();

// Run the jest test suite with our jest config and all the optional flags the user provided
runCommand('jest', ['--config', paths.jestConfigPath, ...other]);
