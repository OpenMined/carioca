#! /usr/bin/env node
import { sync } from 'cross-spawn';

const [task] = process.argv.slice(2);
const devConfig = require.resolve(`./config/dev.config.js`);
const prodConfig = require.resolve(`./config/prod.config.js`);

let result;

switch (task) {
  case 'dev': {
    result = sync('webpack-dev-server', ['--config', devConfig, '--progress'], {
      stdio: 'inherit',
    });
    break;
  }
  case 'build': {
    result = sync('webpack', ['--config', prodConfig, '--progress'], {
      stdio: 'inherit',
    });
    break;
  }
  default:
    console.log(`Unknown script "${task}".`);
}

if (result.signal) {
  process.exit(1);
}

process.exit(result.status);
