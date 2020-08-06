#! /usr/bin/env node
const spawn = require('cross-spawn');

const devConfig = require.resolve('./src/webpack.dev.js');
const prodConfig = require.resolve('./src/webpack.prod.js');

const [task] = process.argv.slice(2);

let result;

// NOTE: These should be identical to the scripts in package.json
switch (task) {
  case 'dev': {
    result = spawn.sync(
      'webpack-dev-server',
      ['--config', devConfig, '--progress'],
      { stdio: 'inherit' }
    );
    break;
  }
  case 'build': {
    result = spawn.sync('webpack', ['--config', prodConfig, '--progress'], {
      stdio: 'inherit'
    });
    break;
  }
  default:
    console.log(`Unknown script "${task}".`);
}

if (result.signal) process.exit(1);

process.exit(result.status);
