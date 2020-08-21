const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Clean the output directory
module.exports = () => ({
  plugins: [new CleanWebpackPlugin()],
});
