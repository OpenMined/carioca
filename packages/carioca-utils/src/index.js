const definePaths = require('./define-paths');
const createConfig = require('./create-config');

// Create config helpers
const setContext = require('./config/context');
const setTarget = require('./config/target');
const setMode = require('./config/mode');
const { setClientEntries, setServerEntries, setEntry } = require('./config/entry');
const { setClientOutput, setServerOutput, setOutput } = require('./config/output');
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

module.exports = {
  definePaths,
  createConfig,
  createConfigHelpers: {
    setContext,
    setTarget,
    setMode,
    setClientEntries,
    setServerEntries,
    setEntry,
    setClientOutput,
    setServerOutput,
    setOutput,
    setResolves,
    setEnvironmentVariables,
    compileJSAndTS,
    compileCSS,
    compileCSV,
    compileStaticAssets,
    compileSourceMaps,
    compileAssetsManifest,
    runCopyPublic,
    runSetupNode,
    setPeerDeps,
    setNodeExternals,
    runCleanDirectory,
    compileChunks
  }
};
