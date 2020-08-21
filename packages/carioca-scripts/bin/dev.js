#! /usr/bin/env node

const UniversalHotReload = require('universal-hot-reload').default;
const { createConfig, definePaths } = require('@carioca/utils');

const paths = definePaths();

const clientConfig = createConfig('web', 'development', 'run', paths);
const serverConfig = createConfig('node', 'development', 'run', paths);

UniversalHotReload({ clientConfig, serverConfig });
