const chalk = require('chalk');

const log = console.log;
const color = '#222222';

module.exports = {
  error: (text, ...args) =>
    log(`🏝️  ${chalk.bold.hex(color).bgRed('ERROR')} ${text}`, ...args),
  warning: (text, ...args) =>
    log(`🏝️  ${chalk.bold.hex(color).bgYellow('WARNING')} ${text}`, ...args),
  success: (text, ...args) =>
    log(`🏝️  ${chalk.bold.hex(color).bgGreen('Success')} ${text}`, ...args),
  info: (text, ...args) => log(`🏝️  ${text}`, ...args),
};
