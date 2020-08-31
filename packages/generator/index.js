#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const commandExistsSync = require('command-exists').sync;

// Require commander
const { program } = require('commander');

// Require a few functions from the utils project
const { runCommand, definePaths, info, success } = require('@carioca/utils');

// Require our package.json file
const pkg = require('./package.json');

// TODO: GETTING ERROR: Couldn't find package "@carioca/utils@^0.1.2" required by "@carioca/scripts@latest" on the "npm" registry.
// TODO: Remember to have a spa version and an ssr version
// TODO: Copy .gitignore, LICENSE, and README files
// TODO: Do inline documentation on everything
// TODO: Remove generator package from the test app

// Define the commander script
program
  .version(pkg.version)
  .arguments('<name> [mode]')
  .action((name, mode = 'ssr') => {
    info(`Creating app "${name}" in ${mode.toUpperCase()} mode`);

    const paths = definePaths();
    const filesToChange = ['package.json', 'src/App.jsx', 'public/index.html', 'public/site.webmanifest'];
    const matchingString = '%APP-NAME%';

    const templatePath = path.resolve(__dirname, 'template');
    const appPath = paths.resolveApp(name);

    info(`Copying files and folders from template...`);
    fs.copySync(templatePath, appPath, { filter: (src, dest) => {
      if(mode === 'spa' && src.includes('server.js')) return false;

      return true;
    }});

    info(`Rewriting files...`);
    filesToChange.forEach(file => {
      const fileLocation = path.resolve(appPath, file);

      let result = fs.readFileSync(fileLocation, { encoding: 'utf-8' });
      result = result.replace(matchingString, name);
      
      fs.writeFileSync(fileLocation, result, { encoding: 'utf-8' });
    });

    const packageManager = commandExistsSync('yarn') ? 'yarn' : 'npm';
    const runScript = packageManager === 'yarn' ? 'yarn dev' : 'npm run dev';

    info(`Installing dependencies with ${packageManager}...`);
    process.chdir(name);
    runCommand(packageManager, ['install']);
    process.chdir('../');

    success(`App "${name}" created successfully!`);
    info(`Please run "cd ${name}" and "${runScript}" to get started.`);
  })

// Tell our CLI to parse the arguments it's given and we're off to the races!
program.parse(process.argv);
