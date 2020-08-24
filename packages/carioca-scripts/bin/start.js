#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const { definePaths } = require('@carioca/utils');
const runCommand = require('../scripts/run-command');

// Determine our paths
const paths = definePaths();

const serverBuildFile = path.resolve(paths.outputDirectory, 'server.js');

if (fs.existsSync(serverBuildFile)) {
  runCommand('node', [serverBuildFile]);
} else {
  runCommand('http-server', [
    paths.outputDirectory,
    '-p',
    3000,
    '--cors',
    '-a',
    'localhost',
  ]);
}
