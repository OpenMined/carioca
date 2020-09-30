// Make sure to base-64 encode all images in the final JS source code
module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.(ico|jpg|jpeg|png|svg|bmp|webp|gif|pdf)$/,
        use: {
          loader: 'url-loader',
          options: {
            // Limit it to roughly 8kb
            limit: 8000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      },
    ],
  },
});
