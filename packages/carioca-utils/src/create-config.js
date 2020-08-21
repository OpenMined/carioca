// Import Webpack merge
const { merge } = require('webpack-merge');

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
const runSetupNode = require('./config/node');
const setPeerDeps = require('./config/peer-deps');
const setNodeExternals = require('./config/externals');
const runCleanDirectory = require('./config/clean');
const compileChunks = require('./config/chunks');

module.exports = (t, m, i, paths) => {
  const vars = {
    // Is is the client or the server?
    IS_CLIENT: t === 'web',
    IS_SERVER: t === 'node',

    // Are we in development or production mode?
    IS_DEV: m === 'development',
    IS_PROD: m === 'production',

    // Are we trying to run the app or make a build of it?
    IS_LIVE: i === 'run',
    IS_BUILD: i === 'build',

    // Define the default ports
    PORT: 3000,
    DEV_PORT: 3001,
  };

  process.env.NODE_ENV = m;

  const context = setContext();
  const target = setTarget(t);
  const mode = setMode(m);
  const entries = vars.IS_CLIENT
    ? setClientEntries(paths)
    : setServerEntries(paths);
  const output = vars.IS_CLIENT
    ? setClientOutput(paths, vars)
    : setServerOutput(paths, vars);
  const resolves = setResolves(paths);
  const envs = setEnvironmentVariables(paths, vars);
  const javascript = compileJSAndTS(paths, vars);
  const css = compileCSS(vars);
  const csv = compileCSV();
  const staticAssets = compileStaticAssets();
  const sourceMaps = compileSourceMaps(vars);
  const assetsManifest = compileAssetsManifest(paths);
  const copyPublic = runCopyPublic(paths);
  const setupNode = runSetupNode();
  const peerDeps = setPeerDeps();
  const nodeExternals = setNodeExternals();
  const cleanDirectory = runCleanDirectory();
  const chunks = compileChunks();

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

  if (vars.IS_LIVE) {
    if (vars.IS_CLIENT) {
      return merge([common, assetsManifest, copyPublic]);
    } else if (vars.IS_SERVER) {
      return merge([common, setupNode, peerDeps, nodeExternals]);
    }
  } else if (vars.IS_BUILD) {
    if (vars.IS_CLIENT) {
      return merge([
        common,
        assetsManifest,
        copyPublic,
        peerDeps,
        cleanDirectory,
        chunks,
      ]);
    } else if (vars.IS_SERVER) {
      return merge([common, setupNode, peerDeps]);
    }
  }
};
