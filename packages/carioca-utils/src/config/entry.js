// Define the entry paths
module.exports = {
  setClientEntries: (paths) => ({
    entry: [paths.clientEntry],
  }),
  setServerEntries: (paths) => ({
    entry: [paths.serverEntry],
  }),
  setEntry: (entry) => ({
    entry,
  }),
};
