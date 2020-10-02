const fs = require('fs');
const ESLintPlugin = require('eslint-webpack-plugin');

// Define the loader for compiling both Javascript and Typescript
module.exports = (paths) => {
  const esLintConfig = JSON.parse(
    fs.readFileSync(paths.esLintConfigPath, {
      encoding: 'utf-8',
    })
  );

  const babelConfig = JSON.parse(
    fs.readFileSync(paths.babelConfigPath, {
      encoding: 'utf-8',
    })
  );

  return {
    plugins: [
      new ESLintPlugin({
        context: paths.sourceDirectory,
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        baseConfig: esLintConfig,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          include: paths.sourceDirectory,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: babelConfig,
        },
      ],
    },
  };
};
