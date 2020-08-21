// Set up good node defaults
// Perhaps this isn't necessary, but better safe than sorry
module.exports = () => ({
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
});
