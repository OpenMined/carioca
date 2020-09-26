const url = require('url');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

module.exports = (clientConfig) => {
  // Get some variables from the clientConfig
  const {
    entry,
    output: { publicPath },
    plugins,
    devServer = {},
  } = clientConfig;

  // Get URL information from the publicPath of the output
  const { protocol, host, hostname, port } = url.parse(publicPath);

  // And compose the devServer URL
  const devServerUrl = `${protocol}//${host}`;

  // Declare hot module reload and add some entries for Webpack to watch
  const hmrPlugin = new webpack.HotModuleReplacementPlugin();
  const hmrEntries = [
    `${require.resolve('webpack-dev-server/client/')}?${devServerUrl}`,
    require.resolve('webpack/hot/dev-server'),
  ];

  // Push those HMR entries to the Webpack config entries list
  if (entry.push) clientConfig.entry = entry.concat(hmrEntries);
  else clientConfig.entry = [entry, ...hmrEntries];

  // Add the HMR plugin to the Webpack config plugins list
  if (!plugins) clientConfig.plugins = [hmrPlugin];
  else plugins.push(hmrPlugin);

  // Create a webpack compiler from the amended config
  const compiler = webpack(clientConfig);

  // Create a webpack-dev-server from that config and also pass a default config
  const server = new webpackDevServer(compiler, {
    publicPath,
    quiet: true,
    noInfo: true,
    lazy: false,
    stats: 'errors-only',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    sockPort: port,
    ...devServer, // Allow us to override this default config elsewhere
  });

  // Start to listen to the webpack-dev-server
  server.listen(port, hostname);
};
