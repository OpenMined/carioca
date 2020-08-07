// Import some Node libraries
const fs = require('fs');
const path = require('path');

// Define the root of where this dependency is installed - very important!
const appRoot = path.resolve(process.cwd());

// Define two functions:
// - One to resolve paths to the installation location
// - Another to resolve paths to this project
const resolveApp = (relativePath) => path.resolve(appRoot, relativePath);
const resolveSelf = (relativePath) =>
  path.resolve(__dirname, '..', relativePath);

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
  const configFileAppPath = resolveApp(name);

  // Does the requested config file exist at the root?
  const configFileExists = fs.existsSync(configFileAppPath);

  // If it does then use it... if not, create one and return that path
  if (configFileExists) return configFileAppPath;

  // Define our requested config template file
  const configFileTemplatePath = resolveSelf(`templates/${name}`);

  // Read that template file and parse it as JSON
  let configFileTemplate = JSON.parse(
    fs.readFileSync(configFileTemplatePath, {
      encoding: 'utf-8',
    })
  );

  // Run the provided modifications against that template
  configFileTemplate = modifications(configFileTemplate);

  // Define the path where the output requested config file will be generated to
  const outputConfigFilePath = output || resolveSelf(`tmp/${name}`);

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
      resolveSelf('templates/declarations.d.ts'),
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
    resolveApp('.prettierrc')
  );

const defineJestConfigFile = (paths) =>
  defineConfigFile(
    paths,
    '.jestrc',
    (template) => template,
    resolveApp('.jestrc')
  );

module.exports = () => {
  // According to the appRoot, get our package.json files and parse it
  const packageFile = resolveApp('package.json');
  const parsedPackageFile = JSON.parse(fs.readFileSync(packageFile));

  // Define a couple paths to reuse throughout generating our final Webpack configuration files
  const paths = {
    appRoot,
    ownRoot: resolveSelf('.'),
    appPackage: packageFile,
    envFile: resolveApp('.env'),
    sourceDirectory: resolveApp('src'),
    publicDirectory: resolveApp('public'),
    outputDirectory: resolveApp('dist'),
    sourceEntry: resolveApp(parsedPackageFile.main),
    publicHTMLTemplate: resolveApp('public/index.html'),
  };

  // Check for the existence of various configuration files in the appRoot
  // If they do not exist, create them, and return their location
  paths.tsConfigPath = defineTSConfigFile(paths);
  paths.esLintConfigPath = defineESLintConfigFile(paths);
  paths.prettierConfigPath = definePrettierConfigFile(paths);
  paths.jestConfigPath = defineJestConfigFile(paths);

  return paths;
};
