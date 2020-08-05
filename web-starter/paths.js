import { resolve, join } from 'path';

const appRoot = resolve(process.cwd());

const PATHS = {
  appRoot,
  htmlTemplate: join(appRoot, 'index.html'),
  clientBundleEntry: join(appRoot, 'src/client.jsx'),
  outputDirectory: join(appRoot, 'dist/'),
};

export default PATHS;
