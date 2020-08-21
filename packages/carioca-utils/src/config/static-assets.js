// Make sure to base-64 encode all images in the final JS source code
module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|svg|bmp|webp|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      },
    ],
  },
});
