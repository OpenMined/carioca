#! /usr/bin/env node

const mri = require('mri');
const { definePaths } = require('@carioca/utils');

const runCommand = require('../scripts/run-command');

const args = mri(process.argv.slice(2));
const other = [];

delete args._;

Object.entries(args).forEach((a) => {
  if (a[1] === true) other.push(`--${a[0]}`);
  else other.push(`--${a[0]}=${a[1]}`);
});

const paths = definePaths();
runCommand('jest', ['--config', paths.jestConfigPath, ...other]);
