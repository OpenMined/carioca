module.exports = {
  devScript: 'dev',
  excludes: (mode) => {
    if (mode === 'spa') return ['src/server.js'];
  },
  modifications: (file, contents, name, folder, mode) => {
    if (file.includes('package.json')) {
      contents = contents.replace(/%APP-NAME%/g, folder);
    } else {
      contents = contents.replace(/%APP-NAME%/g, name);
    }

    if (mode === 'spa' && file.includes('package.json')) {
      const parsedPackage = JSON.parse(contents);

      parsedPackage.scripts.dev = `${parsedPackage.scripts['dev']} --mode spa`;
      parsedPackage.scripts.build = `${parsedPackage.scripts['build']} --mode spa`;
      parsedPackage.scripts[
        'build:dev'
      ] = `${parsedPackage.scripts['build:dev']} --mode spa`;

      delete parsedPackage.carioca.server;

      contents = JSON.stringify(parsedPackage, null, 2);
    }

    return contents;
  },
};
