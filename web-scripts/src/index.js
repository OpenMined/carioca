// Import some Node libraries
const fs = require('fs');
const path = require('path');

// A simple recursive function to ensure that a directory exists before writing a file
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);

  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

// A function that takes all the current paths, the name of the file you want to copy
// And the modifications that you want to perform to that file before copying
const defineConfigFile = (paths, name, modifications, output) => {
  // Get the requested config file from the appRoot
  const configFileAppPath = path.join(paths.appRoot, name);

  // Does the requested config file exist at the root?
  const configFileExists = fs.existsSync(configFileAppPath);

  // If it does then use it... if not, create one and return that path
  if (configFileExists) return configFileAppPath;

  // Define our requested config template file
  const configFileTemplatePath = path.join(__dirname, `../templates/${name}`);

  // Read that template file and parse it as JSON
  let configFileTemplate = JSON.parse(
    fs.readFileSync(configFileTemplatePath, {
      encoding: 'utf-8',
    })
  );

  // Run the provided modifications against that template
  configFileTemplate = modifications(configFileTemplate);

  // Define the path where the output requested config file will be generated to
  const outputConfigFilePath = output || path.join(__dirname, `../tmp/${name}`);

  // Make sure that output path exists, if not, create the appropriate directories
  ensureDirectoryExistence(outputConfigFilePath);

  // Write the file, based on the template to that output path
  fs.writeFileSync(
    outputConfigFilePath,
    JSON.stringify(configFileTemplate, null, 2)
  );

  // Return the path to the newly-generate output requested config file
  return outputConfigFilePath;
};

const defineTSConfigFile = (paths) =>
  defineConfigFile(paths, 'tsconfig.json', (template) => {
    // Make sure to tell the template to include all files inside the source directory
    template.include = [
      `${paths.sourceDirectory}/**/*`,
      path.join(__dirname, '../templates/declarations.d.ts'),
    ];

    // Make sure to tell the template not to transpile the output directory
    template.exclude.push(paths.outputDirectory);

    return template;
  });

const defineESLintConfigFile = (paths) =>
  defineConfigFile(paths, '.eslintrc', (template) => {
    // Tell ESLint where our tsconfig.json file is located
    template.parserOptions.project = paths.tsConfigPath;

    return template;
  });

const definePrettierConfigFile = (paths) =>
  defineConfigFile(
    paths,
    '.prettierrc',
    (template) => template,
    path.join(paths.appRoot, '.prettierrc')
  );

module.exports = () => {
  // Define the root of where this dependency is install - very important!
  const appRoot = path.resolve(process.cwd());

  // According to the appRoot, get our package.json files and parse it
  const packageFile = path.join(appRoot, 'package.json');
  const parsedPackageFile = JSON.parse(fs.readFileSync(packageFile));

  // Define a couple paths to reuse throughout generating our final Webpack configuration files
  const paths = {
    appRoot,
    sourceDirectory: path.join(appRoot, 'src'),
    publicDirectory: path.join(appRoot, 'public'),
    outputDirectory: path.join(appRoot, 'dist'),
    sourceEntry: path.join(appRoot, parsedPackageFile.main),
    publicHTMLTemplate: path.join(appRoot, 'public/index.html'),
  };

  // Check for the existence of various configuration files in the appRoot
  // If they do not exist, create them, and return their location
  paths.tsConfigPath = defineTSConfigFile(paths);
  paths.esLintConfigPath = defineESLintConfigFile(paths);
  paths.prettierConfigPath = definePrettierConfigFile(paths);

  return paths;
};
