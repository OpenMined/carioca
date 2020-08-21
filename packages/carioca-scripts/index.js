#!/usr/bin/env node

/*
ISSUES:
- yarn build creates a static folder outside of dist/public in the dist folder
- FOUC on dev

TODO:
- Add support for custom ports
- Add options and examples to sade scripts
- Add support for metadata via page component
- Add internationalization
- Add support for custom templates
- Add support for SPA
- Clean up the logs and make them more attractive
- Add support for Preact with compat
- Document ALL the features and things this can do
- Add acknoledgements
- Change github description
- Use auto-changelog
- Create CLI for web-generator and make sure to include all the manifest files too
  (with a link on how to generate them)
- When doing the CLI, make sure to also copy .gitignore, LICENSE, and README
- Publish initial version
- Write tests for everything
- Support the ability for @carioca/server to use the existing code for building JS instead of babel-loader
- Add prettier formatting and eslint to projects themselves
- Add support for content security policies: https://webpack.js.org/guides/csp/
- Add support for PWA's: https://webpack.js.org/guides/progressive-web-application/
- Support internationalization and also PWA's over multiple origins: https://web.dev/multi-origin-pwas/
- Upgrade to Webpack 5 when released
*/

// Require sade
const sade = require('sade');

// Require a helpful script for running commands
const runCommand = require('./scripts/run-command');

// Require our package.json file
const pkg = require('./package.json');

// Define the sade script
const prog = sade('@carioca/scripts');

// Add the version information to our sade CLI
prog.version(pkg.version);

// Add the build script (production)
prog
  .command('build')
  .describe('Build the application in production mode.')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/build')].concat(process.argv.slice(3))
    );
  });

// Add the build script (development)
prog
  .command('build:dev')
  .describe('Build the application in development mode.')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/build')].concat(process.argv.slice(3))
    );
  });

// Add the development script (live-reload)
prog
  .command('dev')
  .describe('Start the application in development mode.')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/dev')].concat(process.argv.slice(3))
    );
  });

// Add the test script
prog
  .command('test')
  .describe('Runs the test suite (supports all Jest CLI flags).')
  .example('test --watch')
  .example('test --coverage')
  .example('test --passWithNoTests --verbose')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/test')].concat(process.argv.slice(3))
    );
  });

// Tell our CLI to parse the arguments it's given and we're off to the races!
prog.parse(process.argv);
