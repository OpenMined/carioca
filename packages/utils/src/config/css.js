const CSSNano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCSSPresetEnv = require('postcss-preset-env');

// Define the loader for compiling CSS
module.exports = ({ IS_BUILD, IS_CLIENT, IS_LIVE }, separatePaths) => {
  // Use the css-loader and postcss-loader with minification
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

  // If we're building the client, make them files instead of inlining
  if (IS_BUILD && IS_CLIENT) cssRules.unshift(MiniCssExtractPlugin.loader);

  // Otherwise, inline the CSS and load it
  if (IS_LIVE && IS_CLIENT) cssRules.unshift('style-loader');

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: cssRules,
          ...separatePaths,
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
