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

// A simple function for safely parsing JSON or JS files
const safeJSONParse = (data) => {
  try {
    return { data: JSON.parse(data), isJSON: true };
  } catch (e) {
    return { data, isJSON: false };
  }
};

// A function that takes all the current paths, the name of the file you want to copy
// and the modifications that you want to perform to that file before copying
const defineConfigFile = (
  { resolveApp, resolveSelf },
  name,
  modifications,
  output
) => {
  // Get the requested config file from the appRoot
  // Also get the theoretical locations of the file in the temp and templates directories
  const configFileAppPath = resolveApp(name);
  const configFileTempPath = resolveSelf(`tmp/${name}`);
  const configFileTemplatePath = resolveSelf(`templates/${name}`);

  // Does the requested config file exist at the root... if so, return it
  if (fs.existsSync(configFileAppPath)) return configFileAppPath;

  // Does the requested config file exist at the temp directory... if so, return it
  if (fs.existsSync(configFileTempPath)) return configFileTempPath;

  // Otherwise...
  // Read that template file and parse it as JSON
  let configFileTemplate = safeJSONParse(
    fs.readFileSync(configFileTemplatePath, {
      encoding: 'utf-8',
    })
  );

  // Run the provided modifications against that template
  if (modifications) {
    configFileTemplate.data = modifications(configFileTemplate.data);
  }

  // Define the path where the output requested config file will be generated to
  const outputConfigFilePath = output || resolveSelf(`tmp/${name}`);

  // Make sure that output path exists, if not, create the appropriate directories
  ensureDirectoryExistence(outputConfigFilePath);

  // Write the file, based on the template to that output path
  fs.writeFileSync(
    outputConfigFilePath,
    configFileTemplate.isJSON
      ? JSON.stringify(configFileTemplate.data, null, 2)
      : configFileTemplate.data
  );

  // Return the path to the newly-generate output requested config file
  return outputConfigFilePath;
};

// Optionally create, and then return the location of the main tsconfig.json file
const defineTSConfigFile = (paths) =>
  defineConfigFile(paths, 'tsconfig.json', (template) => {
    // Make sure to tell the template to include all files inside the source directory
    template.include = [
      `${paths.sourceDirectory}/**/*`,
      paths.resolveSelf('templates/declarations.d.ts'),
    ];

    // Make sure to tell the template not to transpile the output directory
    template.exclude.push(paths.outputDirectory);

    return template;
  });

const defineBabelConfigFile = (paths) =>
  defineConfigFile(paths, 'babel.config.js');

// Optionally create, and then return the location of the main .eslintrc file
const defineESLintConfigFile = (paths) =>
  defineConfigFile(paths, '.eslintrc', (template) => {
    // Tell ESLint where our tsconfig.json file is located
    template.parserOptions = {};
    template.parserOptions.project = paths.tsConfigPath;

    return template;
  });

// Optionally create, and then return the location of the main .prettierrc file
const definePrettierConfigFile = (paths) =>
  defineConfigFile(paths, '.prettierrc', null, paths.resolveApp('.prettierrc'));

// Optionally create, and then return the location of the main jest.config.js file
const defineJestConfigFile = (paths) =>
  defineConfigFile(paths, 'jest.config.js', (template) => {
    // Define our matching string (in the jest.config.js template file)
    const match = '/* CUSTOM JEST HERE */';

    // Define our overrides
    const custom = [
      `rootDir: '${paths.appRoot}'`,
      `collectCoverageFrom: [
        '<rootDir>/${paths.relativePaths.sourceDirectory}/**/*.{js,jsx,ts,tsx}',
        '!<rootDir>/node_modules/**/*',
        '!<rootDir>/coverage/**/*',
        '!<rootDir>/${paths.relativePaths.outputDirectory}/**/*'
      ]`,
    ];

    // Find an replace the overrides at the matching string
    template = template.replace(match, `${custom.join(',')},`);

    return template;
  });

// The main definePaths function!
// This will determine all the paths to all the things that we care about
// Some of this is used by Webpack to intelligently create config files
// And some of it will be available for the end-developer via environment variables
const definePaths = () => {
  // Define a few relative paths
  const relativePaths = {
    sourceDirectory: 'src',
    publicDirectory: 'public',
    outputDirectory: 'dist',
    outputClientDirectory: 'dist/public',
  };

  // Define the root of where this dependency is installed - very important!
  const appRoot = path.resolve(process.cwd());

  // Define two functions:
  // - One to resolve paths to the installation location
  // - Another to resolve paths to this project
  const resolveApp = (relativePath) => path.resolve(appRoot, relativePath);
  const resolveSelf = (relativePath) =>
    path.resolve(__dirname, '..', relativePath);

  // According to the appRoot, get our package.json files and parse it
  const packageFile = resolveApp('package.json');
  const parsedPackageFile = JSON.parse(fs.readFileSync(packageFile));

  // Define a couple paths to reuse throughout generating our final Webpack configuration files
  const paths = {
    relativePaths,
    appRoot,
    resolveApp,
    resolveSelf,
    ownRoot: resolveSelf('.'),
    appPackage: packageFile,
    appPackageParsed: parsedPackageFile,
    appNodeModules: resolveApp('node_modules'),
    envFile: resolveApp('.env'),
    sourceDirectory: resolveApp(relativePaths.sourceDirectory),
    publicDirectory: resolveApp(relativePaths.publicDirectory),
    outputDirectory: resolveApp(relativePaths.outputDirectory),
    outputClientDirectory: resolveApp(relativePaths.outputClientDirectory),
    assetsManifestFile: resolveApp(
      `${relativePaths.outputDirectory}/assets.json`
    ),
    clientEntry: resolveApp(parsedPackageFile['carioca'].client),
    publicHTMLTemplate: resolveApp(
      `${relativePaths.publicDirectory}/index.html`
    ),
  };

  // If there's a server entry in the package.json file, add it to the paths
  if (parsedPackageFile['carioca'].server) {
    paths.serverEntry = resolveApp(parsedPackageFile['carioca'].server);
  }

  // Check for the existence of various configuration files in the appRoot
  // If they do not exist, create them, and return their location
  paths.tsConfigPath = defineTSConfigFile(paths);
  paths.babelConfigPath = defineBabelConfigFile(paths);
  paths.esLintConfigPath = defineESLintConfigFile(paths);
  // paths.prettierConfigPath = definePrettierConfigFile(paths);
  paths.jestConfigPath = defineJestConfigFile(paths);

  return paths;
};

module.exports = definePaths;
