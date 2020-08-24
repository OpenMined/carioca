const chalk = require('chalk');

const log = console.log;
const color = '#222222';

module.exports = {
  error: (text, ...args) =>
    log(`${chalk.bold.hex(color).bgRed('Error')} ${chalk.red(text)}`, ...args),
  warning: (text, ...args) =>
    log(
      `${chalk.bold.hex(color).bgYellow('Warning')} ${chalk.yellow(text)}`,
      ...args
    ),
  success: (text, ...args) => log(chalk.bold.hex(color).bgGreen(text), ...args),
  info: (text, ...args) => log(chalk.bold.hex(color).bgWhite(text), ...args),
};
