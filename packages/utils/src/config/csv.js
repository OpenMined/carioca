// Define the loader for compiling CSV's and TSV's
module.exports = (separatePaths) => ({
  module: {
    rules: [
      {
        test: /\.(csv|tsv)$/,
        loader: 'csv-loader',
        ...separatePaths,
      },
    ],
  },
});
