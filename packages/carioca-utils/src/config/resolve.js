// Make sure to resolve all files where Javascript code will exist (in some form)
module.exports = (paths) => ({
  resolve: {
    modules: ['node_modules', paths.appNodeModules],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
});
