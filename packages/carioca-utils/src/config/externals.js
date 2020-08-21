const nodeExternals = require('webpack-node-externals');

// Make sure Node knows to add node_modules to the list of externals
module.exports = (others = []) => ({
  externals: [nodeExternals(), ...others],
});
