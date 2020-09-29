#!/usr/bin/env node

// Include a few node and support libraries
const fs = require('fs-extra');
const path = require('path');
const commandExistsSync = require('command-exists').sync;

// Require inquirer
const inquirer = require('inquirer');

// Require a few functions from the utils project
const { runCommand, info, error, success } = require('@carioca/utils');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What do you want your app to be called?',
      default: 'My Carioca App',
    },
    {
      type: 'input',
      name: 'folder',
      message: 'Where do you want it to be located?',
      default: ({ name }) => name.split(' ').join('-').toLowerCase(),
    },
    {
      type: 'list',
      name: 'mode',
      message: 'What type of app is this?',
      choices: [
        {
          name: 'Server-side rendered (SSR)',
          value: 'ssr',
        },
        {
          name: 'Single-page application (SPA)',
          value: 'spa',
        },
      ],
    },
  ])
  .then(({ name, folder, mode }) => {
    info(`Creating app "${name}" in ${mode.toUpperCase()} mode`);

    // Define the app path the user specified
    const appPath = path.resolve(process.cwd(), folder);

    // Define the template being used and also get the template config file to we know what
    // files to exclude and modifications to make to those files
    const templatePath = path.resolve(__dirname, 'templates/main');
    const templateConfigName = 'carioca-template.js';
    const templateConfig = require(path.resolve(
      templatePath,
      templateConfigName
    ));

    // An empty array to store all the file names that we copy
    const files = [];

    info(`Copying files from template...`);
    fs.copySync(templatePath, appPath, {
      filter: (src, dest) => {
        // We never want to copy the Carioca configuration file from the template
        if (src.includes(templateConfigName)) return false;

        // Make sure to get the list of files that the template wants us to exclude given the mode
        const excludes = templateConfig.excludes(mode) || [];

        // Exclude those files from being copied
        if (excludes.includes(path.relative(appPath, dest))) return false;

        // If we haven't excluded the file yet, push it onto our files array
        files.push(dest);

        // And return true, meaning we want to copy this file
        return true;
      },
    });

    const nonCodeFiles = [
      '.ico',
      '.png',
      '.jpg',
      '.jpeg',
      '.svg',
      '.bmp',
      '.webp',
      '.gif',
      '.pdf',
    ];

    info(`Making file modifications...`);
    files
      .filter(
        (path) =>
          fs.lstatSync(path).isFile() &&
          !nonCodeFiles.some((f) => path.includes(f))
      )
      .forEach((path) => {
        // For all the files in the files array, read the file
        let result = fs.readFileSync(path, { encoding: 'utf-8' });

        // And run various template-defined modifications against each file
        result = templateConfig.modifications(path, result, name, folder, mode);

        // Then re-write those modifications back to itself
        fs.writeFileSync(path, result, { encoding: 'utf-8' });
      });

    // Determine what package manager we're using and determine the way the dev script should be typed
    const packageManager = commandExistsSync('yarn') ? 'yarn' : 'npm';
    const devScript = templateConfig.devScript || 'dev';
    const finalDevScript =
      packageManager === 'yarn' ? `yarn ${devScript}` : `npm run ${devScript}`;

    info(`Installing dependencies with ${packageManager}...`);

    // "cd" into the new app directory
    process.chdir(folder);

    // And run the install script for the appropriate package manager
    runCommand(packageManager, ['install']).then(() => {
      // When we're done, "cd" out of the new app directory back to where we ran this script
      process.chdir('../');

      // We're done! Show some helpful information
      success(
        `App "${name}" created successfully!\n\nPlease run "cd ${folder}" and "${finalDevScript}" to get started.`
      );
    });
  })
  .catch((err) => {
    if (err.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      error("Prompt couldn't be rendered in the current environment", err);
    } else {
      // Something else when wrong
      error('Something went wrong', err);
    }
  });
