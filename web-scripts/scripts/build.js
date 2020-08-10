#! /usr/bin/env node

const preparePaths = require('../helpers/prepare-paths');
const createConfig = require('../helpers/create-config');
const runCommand = require('../helpers/run-command');

// const mri = require('mri');
// const args = mri(process.argv.slice(2));

const paths = preparePaths();
const config = createConfig('development', paths);

runCommand('webpack', ['--config', config, '--progress']);
