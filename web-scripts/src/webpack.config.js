/*
TODO:
- Enable environment variables
- Content security policies: https://webpack.js.org/guides/csp/
- Support SSR
- Upgrade to Webpack 5 when released
- Add support for Jest
- Add support for OMUI
- Create CLI for web-generator and make sure to include all the manifest files too
  (with a link on how to generate them)
- When doing the CLI, make sure to also copy .gitignore, LICENSE, and README
*/

// Import Webpack merge
const { merge } = require('webpack-merge');

// Import our Webpack plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (mode, paths) => {
  // Set the Webpack context, should be the current working directory (the project)
  const setContext = { context: process.cwd() };

  // Set the Webpack mode, either "production" or "development"
  const setMode = { mode };

  // Define the entry paths
  const setEntries = {
    entry: {
      client: [paths.sourceEntry],
    },
  };

  // Define the output paths - we will change the name of the file paths depending on the mode
  const setOutput = {
    output: {
      filename:
        mode === 'production'
          ? '[name].[chunkhash:8].bundle.js'
          : '[name].bundle.js',
      path: paths.outputDirectory,
      chunkFilename: '[name].[chunkhash:8].bundle.js',
      publicPath: '/',
    },
  };

  // Make sure to resolve all files where Javascript code will exist (in some form)
  const resolveExtensions = {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };

  // Define the loader for compiling both Javascript and Typescript
  const addJSAndTSSupport = {
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: paths.tsConfigPath,
          memoryLimit: 4096,
        },
        eslint:
          mode === 'production'
            ? null
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
  };

  // Define the loader for compiling CSS
  const addCSSSupport = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [postcssPresetEnv()],
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
  };

  // Define the loader for compiling CSV's and TSV's
  const addCSVSupport = {
    module: {
      rules: [
        {
          test: /\.(csv|tsv)$/,
          loader: 'csv-loader',
        },
      ],
    },
  };

  // Generate source maps - the type of sourcemap generated depends on the mode
  const generateSourceMaps = {
    devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
  };

  // Make sure to base-64 encode all images in the final JS source code
  const handleStaticAssetsImport = {
    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|png|svg|bmp|webp|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'static/[name].[hash].[ext]',
            },
          },
        },
      ],
    },
  };

  // Make sure to let Webpack know what peer dependencies we define, and mark them as external
  const setPeerDepsAsExternals = {
    plugins: [new PeerDepsExternalsPlugin()],
  };

  // Clean the output directory (production only)
  const cleanDirectory = {
    plugins: [new CleanWebpackPlugin({ verbose: true })],
  };

  // Copy all files in the public directory, except for the index.html file
  const copyPublic = {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: paths.publicDirectory,
            globOptions: {
              ignore: [paths.publicHTMLTemplate],
            },
          },
        ],
      }),
    ],
  };

  // Inject the compiled scripts into the index.html file just before the final </body> tag
  const usepublicHTMLTemplate = {
    plugins: [
      new HTMLWebpackPlugin({
        template: paths.publicHTMLTemplate,
        inject: 'body',
        scriptLoading: 'defer',
      }),
    ],
  };

  // Create various chunks of files and make sure to cache them appropriately (production only)
  const createChunks = {
    optimization: {
      moduleIds: 'hashed',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };

  // Start the hot-reloaded development server (development only)
  const startDevServer = {
    devServer: {
      compress: true,
      hot: true,
      open: true,
      port: 3000,
      historyApiFallback: true,
      overlay: true,
      stats: 'minimal',
    },
  };

  const common = merge([
    setContext,
    setMode,
    setEntries,
    setOutput,
    resolveExtensions,
    addJSAndTSSupport,
    addCSSSupport,
    addCSVSupport,
    generateSourceMaps,
    handleStaticAssetsImport,
    copyPublic,
    usepublicHTMLTemplate,
  ]);

  if (mode === 'development') {
    return merge([common, startDevServer]);
  } else if (mode === 'production') {
    return merge([
      common,
      setPeerDepsAsExternals,
      cleanDirectory,
      createChunks,
    ]);
  }
};
