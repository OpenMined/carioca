const CSSNano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCSSPresetEnv = require('postcss-preset-env');

// Define the loader for compiling CSS
module.exports = ({ IS_BUILD, IS_CLIENT, IS_LIVE }) => {
  const cssRules = [
    {
      loader: 'css-loader',
      options: { importLoaders: 1 },
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [PostCSSPresetEnv(), CSSNano({ preset: 'default' })],
      },
    },
  ];

  if (IS_BUILD && IS_CLIENT) cssRules.unshift(MiniCssExtractPlugin.loader);
  if (IS_LIVE && IS_CLIENT) cssRules.unshift('style-loader');

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: cssRules,
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    ],
  };
};
