const { DefinePlugin } = require('webpack');

module.exports = (paths, { IS_BUILD, PORT }) => {
  // Parse the .env file in the user's project
  const userVars = require('dotenv').config({ path: paths.envFile });

  // Copy them into a new object
  const vars = { ...userVars.parsed };

  // Make sure the server can know where the static assets live
  vars['PUBLIC_DIR'] = IS_BUILD
    ? paths.relativePaths.outputClientDirectory
    : paths.relativePaths.outputDirectory;

  // Make sure the server can know about the assets manifest file
  vars['ASSETS_MANIFEST'] = paths.assetsManifestFile;

  // Make sure the server can know about where the HTML template is located
  vars['HTML_TEMPLATE'] = paths.publicHTMLTemplate;

  // Make sure the server can know what port to listen on
  vars['PORT'] = PORT;

  // Convert all these env vars into something DefinePlugin can understand
  const final = Object.keys(vars).reduce((env, key) => {
    env[`process.env.${key}`] = JSON.stringify(vars[key]);

    return env;
  }, {});

  return {
    plugins: [new DefinePlugin(final)],
  };
};
