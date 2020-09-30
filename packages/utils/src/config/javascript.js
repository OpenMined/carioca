const ESLintPlugin = require('eslint-webpack-plugin');

/*
TODO:
- ESLint
- Jest
*/

// Define the loader for compiling both Javascript and Typescript
module.exports = (paths) => ({
  plugins: [
    new ESLintPlugin({
      eslintPath: paths.esLintConfigPath,
      files: paths.sourceDirectory,
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          configFile: paths.babelConfigPath,
        },
      },
    ],
  },
});
