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

// A simple function for safely parsing JSON or JS files
const safeJSONParse = (data) => {
  try {
    return { data: JSON.parse(data), isJSON: true };
  } catch (e) {
    return { data, isJSON: false };
  }
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
  let configFileTemplate = safeJSONParse(
    fs.readFileSync(configFileTemplatePath, {
      encoding: 'utf-8',
    })
  );

  // Run the provided modifications against that template
  configFileTemplate.data = modifications(configFileTemplate.data);

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
  defineConfigFile(paths, 'jest.config.js', (template) => {
    // Define our matching string (in the jest.config.js template file)
    const match = '/* CUSTOM JEST HERE */';

    // Define our overrides
    const custom = [
      `rootDir: '${paths.appRoot}'`,
      `globals: {
        'ts-jest': {
          tsConfig: '${paths.tsConfigPath}'
        }
      }`,
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

module.exports = () => {
  // According to the appRoot, get our package.json files and parse it
  const packageFile = resolveApp('package.json');
  const parsedPackageFile = JSON.parse(fs.readFileSync(packageFile));

  const relativePaths = {
    sourceDirectory: 'src',
    publicDirectory: 'public',
    outputDirectory: 'dist',
    outputClientDirectory: 'dist/public',
  };

  // Define a couple paths to reuse throughout generating our final Webpack configuration files
  const paths = {
    relativePaths,
    appRoot,
    ownRoot: resolveSelf('.'),
    appPackage: packageFile,
    appNodeModules: resolveApp('node_modules'),
    envFile: resolveApp('.env'),
    sourceDirectory: resolveApp(relativePaths.sourceDirectory),
    publicDirectory: resolveApp(relativePaths.publicDirectory),
    outputDirectory: resolveApp(relativePaths.outputDirectory),
    outputClientDirectory: resolveApp(relativePaths.outputClientDirectory),
    clientEntry: resolveApp(parsedPackageFile['om-web-scripts'].client),
    serverEntry: resolveApp(parsedPackageFile['om-web-scripts'].main),
    publicHTMLTemplate: resolveApp(
      `${relativePaths.publicDirectory}/index.html`
    ),
  };

  // Check for the existence of various configuration files in the appRoot
  // If they do not exist, create them, and return their location
  paths.tsConfigPath = defineTSConfigFile(paths);
  paths.esLintConfigPath = defineESLintConfigFile(paths);
  paths.prettierConfigPath = definePrettierConfigFile(paths);
  paths.jestConfigPath = defineJestConfigFile(paths);

  return paths;
};
