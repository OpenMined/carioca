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

// A function that will either locate an existing tsconfig.json file
// Or create one, should one not exist
const defineTSConfig = (paths) => {
  // Get the tsconfig.json file from the appRoot
  const tsConfigAppPath = path.join(paths.appRoot, 'tsconfig.json');

  // Does the tsconfig.json file exist at the root?
  const tsConfigExists = fs.existsSync(tsConfigAppPath);

  // If it does then use it... if not, create one and return that path
  if (tsConfigExists) return tsConfigAppPath;
  else {
    // Define our tsconfig.json template file
    const tsConfigTemplatePath = path.join(
      __dirname,
      '../templates/tsconfig.json'
    );

    // Read that template file and parse it as JSON
    const tempTSConfigTemplate = JSON.parse(
      fs.readFileSync(tsConfigTemplatePath, {
        encoding: 'utf-8',
      })
    );

    // Make sure to tell the template to include all files inside the source directory
    tempTSConfigTemplate.include = [
      `${paths.sourceDirectory}/**/*`,
      path.join(__dirname, '../templates/declarations.d.ts'),
    ];

    // Make sure to tell the template not to transpile the output directory
    tempTSConfigTemplate.exclude.push(paths.outputDirectory);

    // Define the path where the temp tsconfig.json file will be generated to
    const tempTSConfigPath = path.join(__dirname, '../tmp/tsconfig.json');

    // Make sure that temp path exists, if not, create the appropriate directories
    ensureDirectoryExistence(tempTSConfigPath);

    // Write the file, based on the template to that temp path
    fs.writeFileSync(
      tempTSConfigPath,
      JSON.stringify(tempTSConfigTemplate, null, 2)
    );

    // Return the path to the newly-generate temp tsconfig.json file
    return tempTSConfigPath;
  }
};

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

  // Check for the existence of a tsconfig.json file in the appRoot
  // If one does not exist, create one, and return its location
  paths.tsConfigPath = defineTSConfig(paths);

  return paths;
};
