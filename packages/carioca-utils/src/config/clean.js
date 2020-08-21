const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Clean the output directory every time we build
module.exports = () => ({
  plugins: [new CleanWebpackPlugin()],
});
