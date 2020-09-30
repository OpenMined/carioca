// Import Webpack merge
const { merge } = require('webpack-merge');

// Import all of our custom Webpack transformer functions
const setContext = require('./config/context');
const setTarget = require('./config/target');
const setMode = require('./config/mode');
const { setClientEntries, setServerEntries } = require('./config/entry');
const { setClientOutput, setServerOutput } = require('./config/output');
const setResolves = require('./config/resolve');
const setEnvironmentVariables = require('./config/env');
const compileJSAndTS = require('./config/javascript');
const compileCSS = require('./config/css');
const compileCSV = require('./config/csv');
const compileStaticAssets = require('./config/static-assets');
const compileSourceMaps = require('./config/source-maps');
const compileAssetsManifest = require('./config/assets-manifest');
const runCopyPublic = require('./config/copy-public');
const runHTMLSetup = require('./config/html');
const runSetupNode = require('./config/node');
const setPeerDeps = require('./config/peer-deps');
const setNodeExternals = require('./config/externals');
const runCleanDirectory = require('./config/clean');
const compileChunks = require('./config/chunks');

// Receives a target, intention, env, mode, port, and a paths list (created by definePaths())
module.exports = (config) => {
  // target - what are we trying to build for: "web" or "node"?
  // intention - are we trying to "run" something using HMR or "build" it for deployment?
  // env - what is the environment: "development" or "production"?
  // mode - do we require a server ("ssr") or can it be a client-side only ("spa")?
  // port - what port to we want to run on?
  // paths - the list of paths to various files and folders in the application or in this package

  // Set some global variables
  const vars = {
    // Is is the client or the server?
    IS_CLIENT: config.target === 'web',
    IS_SERVER: config.target === 'node',

    // Are we trying to run the app or make a build of it?
    IS_LIVE: config.intention === 'run',
    IS_BUILD: config.intention === 'build',

    // Are we in development or production mode?
    IS_DEV: config.env === 'development',
    IS_PROD: config.env === 'production',

    // Are we running a server-side rendered application or a single-page application
    IS_SSR: config.mode === 'ssr',
    IS_SPA: config.mode === 'spa',

    // Define the default port
    PORT: config.port,
  };

  const separatePaths = {
    include: [config.paths.sourceDirectory],
    exclude: vars.IS_CLIENT
      ? [/node_modules/, config.paths.serverEntry]
      : [/node_modules/],
  };

  // Make sure the NODE_ENV is set to the mode
  process.env.NODE_ENV = config.env;

  // Call our custom Webpack transformer functions
  const context = setContext();
  const target = setTarget(config.target);
  const mode = setMode(config.env);
  const entries = vars.IS_CLIENT
    ? setClientEntries(config.paths)
    : setServerEntries(config.paths);
  const output = vars.IS_CLIENT
    ? setClientOutput(config.paths, vars)
    : setServerOutput(config.paths, vars);
  const resolves = setResolves(config.paths);
  const envs = setEnvironmentVariables(config.paths, vars);
  const javascript = compileJSAndTS(config.paths, vars, separatePaths);
  const css = compileCSS(vars, separatePaths);
  const csv = compileCSV(separatePaths);
  const staticAssets = compileStaticAssets(separatePaths);
  const sourceMaps = compileSourceMaps(vars);
  const assetsManifest = compileAssetsManifest(config.paths);
  const copyPublic = runCopyPublic(config.paths);
  const htmlTemplate = runHTMLSetup(config.paths);
  const setupNode = runSetupNode();
  const peerDeps = setPeerDeps();
  const nodeExternals = setNodeExternals();
  const cleanDirectory = runCleanDirectory();
  const chunks = compileChunks();

  // Define what all Webpack configs have in common
  const common = merge([
    context,
    target,
    mode,
    entries,
    output,
    resolves,
    envs,
    javascript,
    css,
    csv,
    staticAssets,
    sourceMaps,
  ]);

  // The following if blocks merge the common Webpack config with the specific needs
  if (vars.IS_CLIENT) {
    const client = merge([common, assetsManifest, copyPublic]);

    if (vars.IS_LIVE) {
      if (vars.IS_SSR) {
        return client;
      } else if (vars.IS_SPA) {
        return merge([client, htmlTemplate]);
      }
    } else if (vars.IS_BUILD) {
      const clientBuild = merge([client, peerDeps, cleanDirectory, chunks]);

      if (vars.IS_SSR) {
        return clientBuild;
      } else if (vars.IS_SPA) {
        return merge([clientBuild, htmlTemplate]);
      }
    }
  } else if (vars.IS_SERVER) {
    const server = merge([common, setupNode, peerDeps]);

    if (vars.IS_LIVE) {
      return merge([server, nodeExternals]);
    } else if (vars.IS_BUILD) {
      return server;
    }
  }
};
