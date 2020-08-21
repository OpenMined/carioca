// Define the entry paths
module.exports = {
  // Default for client, based on path
  setClientEntries: (paths) => ({
    entry: [paths.clientEntry],
  }),

  // Default for server, based on path
  setServerEntries: (paths) => ({
    entry: [paths.serverEntry],
  }),

  // Custom entry, whatever you want!
  setEntry: (entry) => ({
    entry,
  }),
};
