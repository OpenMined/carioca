// Create various chunks of files and make sure to cache them appropriately
module.exports = () => ({
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single', // Create a runtime chunk
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors', // Create a vendors chunk
          chunks: 'all',
        },
      },
    },
  },
});
