const { DefinePlugin } = require('webpack');

module.exports = (paths, { IS_BUILD, PORT }) => {
  // Parse the .env file in the user's project
  const userVars = require('dotenv').config({ path: paths.envFile });

  let vars = { ...userVars.parsed };

  // Add the correct server.js public directory to PUBLIC_DIR
  vars['PUBLIC_DIR'] = IS_BUILD
    ? paths.relativePaths.outputClientDirectory
    : paths.relativePaths.outputDirectory;

  // Add the assets manifest file to ASSETS_MANIFEST
  vars['ASSETS_MANIFEST'] = paths.assetsManifestFile;

  // Add the index.html template file to HTML_TEMPLATE
  vars['HTML_TEMPLATE'] = paths.publicHTMLTemplate;

  // Add the PORT to the vars
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
