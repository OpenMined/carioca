const CopyPlugin = require('copy-webpack-plugin');

// Copy all files in the public directory, except for the index.html file
module.exports = (paths) => ({
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: paths.publicDirectory,
          globOptions: {
            ignore: [paths.publicHTMLTemplate],
          },
        },
      ],
    }),
  ],
});
