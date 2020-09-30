const path = require('path');
const webpack = require('webpack');
const clearModule = require('clear-module');

const { error } = require('../log');

// A simpler helper function that allows us to define a new HTTP server
// And keep track of any associated socket connections
const initHttpServer = (bundlePath) => {
  // Have a place to store the new server
  let server;

  try {
    // Try to require the server from the bundle path
    server = require(bundlePath).default;
  } catch (e) {
    // If we can't, log an error
    error('Error creating server', e);
    return null;
  }

  // Keep track of all the sockets in a Map
  const sockets = new Map();
  let nextSocketId = 0;

  // When there's a socket connection
  server.on('connection', (socket) => {
    // Get the ID
    const socketId = nextSocketId++;

    // Add it to the list
    sockets.set(socketId, socket);

    // When that socket connection is closed, remove it from the list
    socket.on('close', () => sockets.delete(socketId));
  });

  // Return both the required server and the Map of sockets
  return { server, sockets };
};

module.exports = (serverConfig) => {
  // Store the HTTP server somewhere
  let httpServerObject;

  // Define the path of the server bundle
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );

  // Create a new Webpack compiler for the server
  const compiler = webpack(serverConfig);

  // Define some configuration options for that compiler
  const options = {
    aggregateTimeout: 300, // Wait this long for more changes
    poll: true, // Use polling instead of native watchers
  };

  // Start the compiler and watch for any file changes
  compiler.watch(options, (err) => {
    // If we have a compilation error
    if (err) {
      error('Error bundling server', err);
      return;
    }

    // Each time we have new files, we should destroy the cached version of the bundle
    clearModule(bundlePath);

    // If we already have an HTTP server, kill it!
    if (httpServerObject) {
      httpServerObject.server.close(() => {
        // ... and then destroy all open socket connections
        for (const socket of httpServerObject.sockets.values()) {
          socket.destroy();
        }
      });
    }

    // Initialize a new HTTP server
    httpServerObject = initHttpServer(bundlePath);
  });
};
