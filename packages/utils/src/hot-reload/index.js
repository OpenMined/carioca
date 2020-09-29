// While we're making a number of modifications and simplifications, this folder is
// directly inspired by the work of Yusinto Ngadiman: https://github.com/yusinto/universal-hot-reload

const watchClient = require('./client');
const watchServer = require('./server');

module.exports = ({ clientConfig, serverConfig }) => {
  // Start webpack-dev-server on one port after the serverConfig's port
  if (clientConfig) {
    watchClient(clientConfig, () => {
      // Start a webpack.watch() on all server files with full HMR support
      if (serverConfig) watchServer(serverConfig);
    });
  }
};
