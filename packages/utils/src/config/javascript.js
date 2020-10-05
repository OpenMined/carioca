const fs = require('fs');
const ESLintPlugin = require('eslint-webpack-plugin');

// Define the loader for compiling both Javascript and Typescript
module.exports = (paths, { IS_BUILD }) => {
  const esLintConfig = JSON.parse(
    fs.readFileSync(paths.esLintConfigPath, {
      encoding: 'utf-8',
    })
  );

  const final = {
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          include: paths.sourceDirectory,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            configFile: paths.babelConfigPath,
          },
        },
      ],
    },
  };

  if (IS_BUILD) {
    final.plugins = [
      new ESLintPlugin({
        context: paths.sourceDirectory,
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        baseConfig: esLintConfig,
      }),
    ];
  }

  return final;
};
