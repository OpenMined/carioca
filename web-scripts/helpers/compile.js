const webpack = require('webpack');

module.exports = (config) => {
  let compiler;

  try {
    compiler = webpack(config);
  } catch (e) {
    console.log('Failed to compile', [e]);
    process.exit(1);
  }

  return compiler;
};
