// Define the loader for compiling both Javascript and Typescript
// Controversial decision: we don't use babel-loader, just ts-loader... why bundle twice?
module.exports = (paths, { IS_PROD }, separatePaths) => ({
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'ts-loader',
        options: {
          configFile: paths.tsConfigPath, // Make sure we know where to find the tsconfig.json file
          transpileOnly: true, // Performance optimization
        },
        ...separatePaths,
      },
    ],
  },
});
