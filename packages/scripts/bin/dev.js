const {
  createConfig,
  definePaths,
  hotReload,
  info,
  success,
} = require('@carioca/utils');

module.exports = (mode, port) => {
  // What to call when we're done
  const onFinish = () =>
    success(
      `Development ${mode.toUpperCase()} server running at http://localhost:${port}`
    );

  // Determine our paths
  info('Defining the paths to your application...');
  const paths = definePaths();

  // Create the client-side and server-side Webpack configs
  info('Creating the configuration for the client...');
  const clientConfig = createConfig({
    target: 'web',
    intention: 'run',
    env: 'development',
    mode,
    port: mode === 'ssr' ? port + 1 : port,
    paths,
  });

  if (mode === 'spa') {
    onFinish();

    // Give it to hotReload
    hotReload({ clientConfig });
  } else {
    info('Creating the configuration for the server...');
    const serverConfig = createConfig({
      target: 'node',
      intention: 'run',
      env: 'development',
      mode,
      port,
      paths,
    });

    onFinish();

    // Give them to hotReload
    hotReload({
      clientConfig,
      serverConfig,
    });
  }
};
