const spawn = require('cross-spawn');

module.exports = (command, args) => {
  const result = spawn.sync(command, args, { stdio: 'inherit' });

  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'Running this command failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'Running this command failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      );
    }

    process.exit(1);
  }

  process.exit(result.status);
};
