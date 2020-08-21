// Generate source maps - the type of sourcemap generated depends on the intention
module.exports = ({ IS_BUILD }) => ({
  devtool: IS_BUILD ? 'source-map' : 'eval-source-map',
});
