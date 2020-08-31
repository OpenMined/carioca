const AssetsWebpackPlugin = require('assets-webpack-plugin');

// Create a file that contains links to all the built assets so that we can embed them via SSR
module.exports = (paths) => ({
  plugins: [
    new AssetsWebpackPlugin({
      path: paths.outputDirectory,
      filename: /[^/]*$/.exec(paths.assetsManifestFile)[0],

      // We want to process the output to make it easier to parse on the server
      // This is used for swapping out relative paths for absolute paths with the dev port included
      processOutput: (assets) => {
        const other = assets[''];

        const flat = (list) =>
          Object.keys(list).reduce((r, k) => {
            if (Array.isArray(list[k])) return flat(list[k]);
            return r.concat({ [/[^/]*$/.exec(list[k])[0]]: list[k] });
          }, []);

        assets.other = flat(other);

        return JSON.stringify(assets);
      },
    }),
  ],
});
