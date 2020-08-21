const nodeExternals = require('webpack-node-externals');

// Make sure Webpack knows to add node_modules to the list of externals
// Also support whatever other externals you want to define, very useful for sub-modules (react-dom/server)
module.exports = (others = []) => ({
  externals: [nodeExternals(), ...others],
});
