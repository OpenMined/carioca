#! /usr/bin/env node

const UniversalHotReload = require('universal-hot-reload').default;

const preparePaths = require('../scripts/prepare-paths').default;
const createConfig = require('../scripts/create-config');

const paths = preparePaths();

const clientConfig = createConfig('web', 'development', 'run', paths);
const serverConfig = createConfig('node', 'development', 'run', paths);

UniversalHotReload({ clientConfig, serverConfig });
