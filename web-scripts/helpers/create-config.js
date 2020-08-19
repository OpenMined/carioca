// Import Webpack merge
const { merge } = require('webpack-merge');

// Import our Webpack plugins
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CSSNano = require('cssnano');
const { DefinePlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');
const PostCSSPresetEnv = require('postcss-preset-env');

module.exports = (target, mode, intention, paths) => {
  // Is is the client or the server?
  const IS_CLIENT = target === 'web';
  const IS_SERVER = target === 'node';

  // Are we in development or production mode?
  const IS_DEV = mode === 'development';
  const IS_PROD = mode === 'production';

  // Are we trying to run the app or make a build of it?
  const IS_LIVE = intention === 'run';
  const IS_BUILD = intention === 'build';

  // Define the default port
  // NOTE: The port for the server running live is PORT, the client (DEV_PORT) is PORT + 1
  const PORT = 3000;
  const DEV_PORT = PORT + 1;

  // TODO: Check if this is necessary...
  process.env.NODE_ENV = mode;

  // Set the Webpack context, should be the current working directory (the project)
  const setContext = { context: process.cwd() };

  // Set the Webpack mode, either "production" or "development"
  const setMode = { mode };

  // Set the target, either "node" or "web"
  const setTarget = { target };

  // Define the entry paths
  const setEntries = {
    entry: IS_CLIENT
      ? { client: [paths.clientEntry] }
      : { server: [paths.serverEntry] },
  };

  // Define the output paths - we will change the name of the file paths depending on the mode
  const setOutput = IS_SERVER
    ? {
        output: {
          filename: '[name].js',
          path: paths.outputDirectory,
          libraryTarget: 'commonjs2',
          publicPath: '/',
        },
      }
    : {
        output: {
          filename: IS_BUILD
            ? 'static/js/[name].[chunkhash:8].js'
            : '[name].js',
          chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
          path: paths.outputClientDirectory,
          publicPath: IS_LIVE ? `http://localhost:${DEV_PORT}/` : '/',
        },
      };

  // Make sure to resolve all files where Javascript code will exist (in some form)
  const resolveExtensions = {
    resolve: {
      modules: ['node_modules', paths.appNodeModules],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };

  const addEnvironmentVariables = () => {
    // Parse the .env file in the user's project
    const { parsed } = require('dotenv').config({ path: paths.envFile });

    // Add the correct server.js public directory to PUBLIC_DIR
    parsed['PUBLIC_DIR'] = IS_BUILD
      ? paths.relativePaths.outputClientDirectory
      : paths.relativePaths.publicDirectory;

    // Add the assets manifest file to ASSETS_MANIFEST
    parsed['ASSETS_MANIFEST'] = paths.assetsManifestFile;

    // Convert all these env vars into something DefinePlugin can understand
    const final = Object.keys(parsed).reduce((env, key) => {
      env[`process.env.${key}`] = JSON.stringify(parsed[key]);

      return env;
    }, {});

    return {
      plugins: [new DefinePlugin(final)],
    };
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
  };

  // Define the loader for compiling CSS
  const addCSSSupport = () => {
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

  // Make sure to base-64 encode all images in the final JS source code
  const addStaticAssetsSupport = {
    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|png|svg|bmp|webp|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        },
      ],
    },
  };

  // Generate source maps - the type of sourcemap generated depends on the mode
  const generateSourceMaps = {
    devtool: IS_BUILD ? 'source-map' : 'eval-source-map',
  };

  const createAssetsFile = {
    plugins: [
      new AssetsWebpackPlugin({
        path: paths.outputDirectory,
        filename: 'assets.json',
      }),
    ],
  };

  // Make sure to let Webpack know what peer dependencies we define, and mark them as external
  const setPeerDepsAsExternals = {
    plugins: [new PeerDepsExternalsPlugin()],
  };

  // Clean the output directory
  const cleanDirectory = {
    plugins: [new CleanWebpackPlugin()],
  };

  // Set up good node defaults
  const setupNode = {
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
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
  const usePublicHTMLTemplate = {
    plugins: [
      new HTMLWebpackPlugin({
        template: paths.publicHTMLTemplate,
        inject: 'body',
        scriptLoading: 'defer',
      }),
    ],
  };

  // Create various chunks of files and make sure to cache them appropriately
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

  // Start the hot-reloaded development server
  const startDevServer = {
    devServer: {
      compress: true,
      hot: true,
      port: DEV_PORT,
      historyApiFallback: true,
      overlay: true,
      stats: 'minimal',
    },
  };

  const common = merge([
    setContext,
    setMode,
    setTarget,
    setEntries,
    setOutput,
    resolveExtensions,
    addEnvironmentVariables(),
    addJSAndTSSupport,
    addCSSSupport(),
    addCSVSupport,
    addStaticAssetsSupport,
    generateSourceMaps,
  ]);

  if (IS_LIVE) {
    if (IS_CLIENT) {
      return merge([
        common,
        createAssetsFile,
        copyPublic,
        usePublicHTMLTemplate,
        startDevServer,
      ]);
    } else if (IS_SERVER) {
      return merge([common, setupNode, setPeerDepsAsExternals]);
    }
  } else if (IS_BUILD) {
    if (IS_CLIENT) {
      return merge([
        common,
        createAssetsFile,
        copyPublic,
        setPeerDepsAsExternals,
        cleanDirectory,
        createChunks,
      ]);
    } else if (IS_SERVER) {
      return merge([common, setupNode, setPeerDepsAsExternals]);
    }
  }
};
