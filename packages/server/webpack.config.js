const path = require('path');
const { merge } = require('webpack-merge');

const {
  createConfigHelpers: {
    setContext,
    setTarget,
    setMode,
    setEntry,
    setOutput,
    setPeerDeps,
    setNodeExternals,
  },
} = require('@carioca/utils');

module.exports = () => {
  const context = setContext();
  const target = setTarget('node');
  const mode = setMode('production');
  const entries = setEntry('./index.js');
  const output = setOutput({
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  });
  const resolves = {
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js'],
    },
  };
  const javascript = {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
      ],
    },
  };
  const peerDeps = setPeerDeps();
  const nodeExternals = setNodeExternals(['react-dom/server']);

  // TODO: Env vars?
  // TODO: Source maps?

  const config = merge([
    context,
    target,
    mode,
    entries,
    output,
    resolves,
    javascript,
    peerDeps,
    nodeExternals,
  ]);

  console.log(JSON.stringify(config));

  return config;
};
