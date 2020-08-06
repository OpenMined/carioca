/*
TODO:
- See about adding support for eslint, prettier, and typescript in parent project
  (without needing to create config files)
- Have eslint fix things automatically
- Figure out a way to support building of path file in order to support typescript (if necessary)
- Enable environment variables
- Content security policies: https://webpack.js.org/guides/csp/
- Test typescript in a separate test-app
- Add support for OMUI
- Upgrade to Webpack 5 when released
- Create CLI for web-generator and make sure to include all the manifest files too
  (with a link on how to generate them)
- When doing the CLI, make sure to also copy .gitignore, LICENSE, and README
*/

// Import some Node libraries
const fs = require('fs');
const path = require('path');

// Import our Webpack plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');

// Define the root of where this dependency is install - very important!
const appRoot = path.resolve(process.cwd());

// According to the appRoot, get our package.json files and parse it
const packageFile = path.join(appRoot, 'package.json');
const parsedPackageFile = JSON.parse(fs.readFileSync(packageFile));

// Define a couple paths to reuse throughout generating our final Webpack configuration files
const paths = {
  appRoot,
  htmlTemplate: path.join(appRoot, 'public/index.html'),
  tsConfigPath: path.join(appRoot, 'tsconfig.json'),
  clientBundleEntry: path.join(appRoot, parsedPackageFile.main),
  publicDirectory: path.join(appRoot, 'public'),
  outputDirectory: path.join(appRoot, 'dist')
};

// Set the Webpack mode, either "production" or "development"
exports.setMode = (mode) => ({ mode });

// Define the entry paths
exports.setEntries = () => ({
  entry: {
    client: [paths.clientBundleEntry]
  }
});

// Define the output paths
// We will change the name of the file paths depending on the mode
exports.setOutput = (mode) => ({
  output: {
    filename:
      mode === 'production'
        ? '[name].[chunkhash:8].bundle.js'
        : '[name].bundle.js',
    path: paths.outputDirectory,
    chunkFilename: '[name].[chunkhash:8].bundle.js',
    publicPath: '/'
  }
});

// Make sure to resolve all files where Javascript code will exist (in some form)
exports.resolveExtensions = () => ({
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
});

// Define the loader for compiling Javascript
exports.addJSSupport = () => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { modules: false }],
            '@babel/preset-react'
          ],
          cacheDirectory: true
        },
        exclude: /node_modules/
      }
    ]
  }
});

// Define the loader for compiling Typescript
exports.addTSSupport = () => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { configFile: paths.tsConfigPath },
        exclude: /node_modules/
      }
    ]
  }
});

// Define the loader for compiling CSS
exports.addCSSSupport = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/
      }
    ]
  }
});

// Define the loader for compiling CSV's and TSV's
exports.addCSVSupport = () => ({
  module: {
    rules: [
      {
        test: /\.(csv|tsv)$/,
        loader: 'csv-loader'
      }
    ]
  }
});

// Generate source maps
// The type of sourcemap generated depends on the mode
exports.generateSourceMaps = (mode) => ({
  devtool: mode === 'production' ? 'source-map' : 'inline-source-map'
});

// Make sure to base-64 encode all images in the final JS source code
exports.handleStaticAssetsImport = () => ({
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'static/[name].[hash].[ext]'
          }
        }
      }
    ]
  }
});

// Make sure to let Webpack know what peer dependencies we define, and mark them as external
exports.setPeerDepsAsExternals = () => ({
  plugins: [new PeerDepsExternalsPlugin()]
});

// Clean the output directory
// Production only
exports.cleanDirectory = () => ({
  plugins: [new CleanWebpackPlugin({ verbose: true })]
});

// Copy all files in the public directory, except for the index.html file
exports.copyPublic = () => ({
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: paths.publicDirectory,
          globOptions: {
            ignore: [paths.htmlTemplate]
          }
        }
      ]
    })
  ]
});

// Inject the compiled scripts into the index.html file just before the final </body> tag
exports.useHTMLTemplate = () => ({
  plugins: [
    new HTMLWebpackPlugin({
      template: paths.htmlTemplate,
      inject: 'body',
      scriptLoading: 'defer' // NOTE: We should investigate if this causes problems
    })
  ]
});

// Create various chunks of files and make sure to cache them appropriately
// Production only
exports.createChunks = () => ({
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
});

// Start the hot-reloaded development server
// Development only
exports.startDevServer = () => ({
  devServer: {
    compress: true,
    hot: true,
    open: true,
    port: 3000,
    historyApiFallback: true
  }
});
