// Define the output paths - for the client we will change the name of the file paths depending on the mode
module.exports = {
  setClientOutput: (paths, { IS_BUILD, IS_LIVE, DEV_PORT }) => ({
    output: {
      filename: IS_BUILD ? 'static/js/[name].[chunkhash:8].js' : 'bundle.js',
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      path: paths.outputClientDirectory,
      publicPath: IS_LIVE ? `http://localhost:${DEV_PORT}/` : '/',
    },
  }),
  setServerOutput: (paths) => ({
    output: {
      filename: 'server.js',
      path: paths.outputDirectory,
      libraryTarget: 'commonjs2',
      publicPath: '/',
    },
  }),
  setOutput: (output) => ({
    output,
  }),
};
