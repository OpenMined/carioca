const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// Define the loader for compiling both Javascript and Typescript
module.exports = (paths, { IS_PROD }) => ({
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: paths.tsConfigPath,
        memoryLimit: 4096,
      },
      eslint: IS_PROD
        ? undefined
        : {
            files: `${paths.sourceDirectory}/**/*.{ts,tsx,js,jsx}`,
            options: {
              configFile: paths.esLintConfigPath,
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
          configFile: paths.tsConfigPath,
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
    ],
  },
});
