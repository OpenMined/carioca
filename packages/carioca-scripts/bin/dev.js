#! /usr/bin/env node

const UniversalHotReload = require('universal-hot-reload').default;
const { createConfig, definePaths } = require('@carioca/utils');

// Determine our paths
const paths = definePaths();

// Create the client-side and server-side Webpack configs
const clientConfig = createConfig('web', 'development', 'run', paths);
const serverConfig = createConfig('node', 'development', 'run', paths);

// Give them to UniversalHotReload
// Doing this manually kinda sucks and gets really confusing... better to let another library handle it
UniversalHotReload({ clientConfig, serverConfig });
