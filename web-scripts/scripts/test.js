#! /usr/bin/env node

const mri = require('mri');

const preparePaths = require('../helpers/prepare-paths');
const runCommand = require('../helpers/run-command');

const args = mri(process.argv.slice(2));
const other = [];

delete args._;

Object.entries(args).forEach((a) => {
  if (a[1] === true) other.push(`--${a[0]}`);
  else other.push(`--${a[0]}=${a[1]}`);
});

const paths = preparePaths();
runCommand('jest', ['--config', paths.jestConfigPath, ...other]);
