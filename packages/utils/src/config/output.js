// Define the output paths
module.exports = {
  // Default client output function, based on paths
  setClientOutput: (paths, { IS_BUILD, IS_LIVE, IS_SSR, PORT }) => ({
    output: {
      // We will change the name of the file paths depending on whether or not we're building
      filename: IS_BUILD ? 'static/js/[name].[chunkhash:8].js' : 'bundle.js',
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      path: IS_SSR ? paths.outputClientDirectory : paths.outputDirectory,

      // Make sure the publicPath is the webpack dev server running on dev port if we're live!
      publicPath: IS_LIVE ? `http://localhost:${PORT}/` : '/',
    },
  }),

  // Default server output function, based on paths
  setServerOutput: (paths) => ({
    output: {
      filename: 'server.js',
      path: paths.outputDirectory,
      libraryTarget: 'commonjs2',
      publicPath: '/',
    },
  }),

  // Custom output, whatever you want!
  setOutput: (output) => ({
    output,
  }),
};
