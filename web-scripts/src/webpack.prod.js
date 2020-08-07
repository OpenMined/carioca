const prepare = require('./index');
const createConfig = require('./webpack.config');

const paths = prepare();

module.exports = createConfig('production', paths);
