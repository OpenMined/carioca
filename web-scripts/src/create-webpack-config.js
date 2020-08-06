/*
TODO:
- Figure out a way to support building of path file in order to support typescript
- Add Typescript support and test in a separate test-app
- Create CLI for web-generator
*/

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

exports.setMode = (mode) => ({ mode });

exports.setEntries = (entries) => ({
  entry: { ...entries }
});

exports.setOutput = (pathToDirectory, mode) => ({
  output: {
    filename:
      mode === 'production'
        ? '[name].[chunkhash:8].bundle.js'
        : '[name].bundle.js',
    path: pathToDirectory,
    chunkFilename: '[name].[chunkhash:8].bundle.js',
    publicPath: '/'
  }
});

exports.resolveExtensions = () => ({
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
});

exports.addJSSupport = () => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
        // options: {
        //   presets: [
        //     ['@babel/preset-env', { modules: false }],
        //     '@babel/preset-react'
        //   ],
        //   cacheDirectory: true
        // }
        exclude: /node_modules/
      }
    ]
  }
});

exports.addTSSupport = (configFile) => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { configFile },
        exclude: /node_modules/
      }
    ]
  }
});

exports.addCSSSupport = () => ({
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
});

exports.startDevServer = () => ({
  devServer: {
    compress: true,
    hot: true,
    historyApiFallback: true,
    disableHostCheck: true,
    host: '127.0.0.1'
  }
});

exports.generateSourceMaps = (type) => ({
  devtool: type
});

exports.handleStaticAssetsImport = (relativePath) => ({
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2|jpg|jpeg|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: `${relativePath}[name].[hash].[ext]`
          }
        }
      }
    ]
  }
});

// https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-3
exports.createVendorChunk = (moduleList) => ({
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: new RegExp(
            `[\\/]node_modules[\\/](${moduleList.join('|')})[\\/]`
          ),
          chunks: 'initial',
          name: 'vendors',
          enforce: true
        }
      }
    }
  }
});

exports.cleanDirectory = () => ({
  plugins: [new CleanWebpackPlugin({ verbose: true })]
});

exports.useHTMLTemplate = (templatePath) => ({
  plugins: [
    new HTMLWebpackPlugin({
      template: templatePath,
      filename: 'index.html',
      inject: 'body'
    })
  ]
});

exports.setHotModuleReplacement = () => ({
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
