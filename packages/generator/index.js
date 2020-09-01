#!/usr/bin/env node

// Include a few node and support libraries
const fs = require('fs-extra');
const path = require('path');
const commandExistsSync = require('command-exists').sync;

// Require commander
const { program } = require('commander');

// Require a few functions from the utils project
const { runCommand, definePaths, info, success } = require('@carioca/utils');

// Require our package.json file
const pkg = require('./package.json');

// Define the commander script
program
  .version(pkg.version)
  .arguments('<name> [mode]')
  .action((name, mode = 'ssr') => {
    info(`Creating app "${name}" in ${mode.toUpperCase()} mode`);

    // Define our paths and get the app path that the user is wanting to run this in
    const paths = definePaths();
    const appPath = paths.resolveApp(name);

    // Define the template being used and also get the template config file to we know what
    // files to exclude and modifications to make to those files
    const templatePath = path.resolve(__dirname, 'templates/main');
    const templateConfigName = 'carioca-template.js';
    const templateConfig = require(path.resolve(templatePath, templateConfigName));

    // An empty array to store all the file names that we copy
    const files = [];

    info(`Copying files from template...`);
    fs.copySync(templatePath, appPath, {
      filter: (src, dest) => {
        // We never want to copy the Carioca configuration file from the template
        if(src.includes(templateConfigName)) return false;
        
        // Make sure to get the list of files that the template wants us to exclude given the mode
        const excludes = templateConfig.excludes(mode) || [];

        // Exclude those files from being copied
        if(excludes.includes(path.relative(appPath, dest))) return false;

        // If we haven't excluded the file yet, push it onto our files array
        files.push(dest);

        // And return true, meaning we want to copy this file
        return true;
      }
    });

    info(`Making file modifications...`);
    files
      .filter(path => fs.lstatSync(path).isFile())
      .forEach(path => {
        // For all the files in the files array, read the file
        let result = fs.readFileSync(path, { encoding: 'utf-8' });

        // And run various template-defined modifications against each file
        result = templateConfig.modifications(path, result, name, mode);
        
        // Then re-write those modifications back to itself
        fs.writeFileSync(path, result, { encoding: 'utf-8' });
      });

    // Determine what package manager we're using and determine the way the dev script should be typed
    const packageManager = commandExistsSync('yarn') ? 'yarn' : 'npm';
    const devScript = templateConfig.devScript || 'dev';
    const finalDevScript = packageManager === 'yarn' ? `yarn ${devScript}` : `npm run ${devScript}`;

    info(`Installing dependencies with ${packageManager}...`);

    // "cd" into the new app directory
    process.chdir(name);

    // And run the install script for the appropriate package manager
    runCommand(packageManager, ['install']).then(() => {
      // When we're done, "cd" out of the new app directory back to where we ran this script
      process.chdir('../');

      // We're done! Show some helpful information
      success(`App "${name}" created successfully!\n\nPlease run "cd ${name}" and "${finalDevScript}" to get started.`);
    })
  })

// Tell our CLI to parse the arguments it's given and we're off to the races!
program.parse(process.argv);
