const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');

// Make sure to let Webpack know what peer dependencies we define, and mark them as external
module.exports = () => ({
  plugins: [new PeerDepsExternalsPlugin()],
});
