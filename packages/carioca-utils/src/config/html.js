const HTMLWebpackPlugin = require('html-webpack-plugin');

// For SPA's, we need to copy the HTML file with all scripts and styles wired up
module.exports = (paths) => ({
  plugins: [
    new HTMLWebpackPlugin({
      template: paths.publicHTMLTemplate,
      inject: 'body',
      scriptLoading: 'defer',
    }),
  ],
});
