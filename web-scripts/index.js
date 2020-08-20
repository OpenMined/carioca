#!/usr/bin/env node

/*
CURRENT ISSUES:
- Dev only works with server.js in the app itself

TODO:
- Remove the html template plugin if possible
- Add support for metadata and favicon
- Add internationalization
- Add support for SPA
- Add options and examples to sade scripts
- Clean up the logs and make them more attractive
- Add support for Preact with compat
- Document ALL the features and things this can do
- Add support for OMUI - consider releasing library as your own (competing with Razzle) and allowing for custom templates
- Create CLI for web-generator and make sure to include all the manifest files too
  (with a link on how to generate them)
- When doing the CLI, make sure to also copy .gitignore, LICENSE, and README
- Add prettier formatting and eslint to projects themselves
- Add support for content security policies: https://webpack.js.org/guides/csp/
- Add support for PWA's: https://webpack.js.org/guides/progressive-web-application/
- Support internationalization and also PWA's over multiple origins: https://web.dev/multi-origin-pwas/
- Upgrade to Webpack 5 when released
- Write tests for everything
- Write documentation for everything
*/

const sade = require('sade');
const runCommand = require('./helpers/run-command');
const pkg = require('./package.json');

const prog = sade('om-web-scripts');

prog.version(pkg.version);

prog
  .command('build')
  .describe('Build the application in production mode.')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./scripts/build')].concat(process.argv.slice(3))
    );
  });

prog
  .command('build:dev')
  .describe('Build the application in development mode.')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./scripts/build')].concat(process.argv.slice(3))
    );
  });

prog
  .command('dev')
  .describe('Start the application in development mode.')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./scripts/dev')].concat(process.argv.slice(3))
    );
  });

prog
  .command('test')
  .describe('Runs the test suite (supports all Jest CLI flags).')
  .example('test --watch')
  .example('test --coverage')
  .example('test --passWithNoTests --verbose')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./scripts/test')].concat(process.argv.slice(3))
    );
  });

// prog
//   .version('1.0.5')
//   .option('--global, -g', 'An example global flag')
//   .option('-c, --config', 'Provide path to custom config', 'foo.config.js');

// prog
//   .command('build <src> <dest>')
//   .describe('Build the source directory. Expects an `index.js` entry file.')
//   .option('-o, --output', 'Change the name of the output file', 'bundle.js')
//   .example('build src build --global --config my-conf.js')
//   .example('build app public -o main.js')
//   .action((src, dest, opts) => {
//     console.log(`> building from ${src} to ${dest}`);
//     console.log('> these are extra opts', opts);
//   });

prog.parse(process.argv);
