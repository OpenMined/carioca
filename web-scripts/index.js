#! /usr/bin/env node
const spawn = require('cross-spawn');

const devConfig = require.resolve('./src/webpack.dev.js');
const prodConfig = require.resolve('./src/webpack.prod.js');

const [task] = process.argv.slice(2);

let result;

// TODO: Need to break this into multiple scripts files and call them individually (see Razzle)
// TODO: Need to also ensure we're running prepare() before yarn test... don't know why testing isn't working
// TODO: When running prepare(), make sure to eventually try to get jest working with a non-root .jestrc
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
      stdio: 'inherit',
    });
    break;
  }
  case 'test': {
    result = spawn.sync('jest', [], {
      stdio: 'inherit',
    });
    break;
  }
  default:
    console.log(`Unknown script "${task}".`);
}

if (result.signal) process.exit(1);

process.exit(result.status);
