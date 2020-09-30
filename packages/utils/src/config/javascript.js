const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// Define the loader for compiling both Javascript and Typescript
// Controversial decision: we don't use babel-loader, just ts-loader... why bundle twice?
module.exports = (paths, { IS_PROD }) => ({
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: paths.tsConfigPath, // Make sure we know where to find the tsconfig.json file
        memoryLimit: 4096, // Make sure we have enough memory
      },
      eslint: IS_PROD
        ? undefined
        : {
            files: `${paths.sourceDirectory}/**/*.{ts,tsx,js,jsx}`,
            options: {
              configFile: paths.esLintConfigPath, // Make sure the tsconfig.json file knows about the .eslintrc file
            },
          },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'ts-loader',
        options: {
          configFile: paths.tsConfigPath, // Make sure we know where to find the tsconfig.json file
          transpileOnly: true, // Performance optimization
        },
        exclude: /node_modules/,
      },
    ],
  },
});
