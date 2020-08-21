const spawn = require('cross-spawn');

module.exports = (command, args) => {
  // Spawn a new command
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

    // Assuming there's no error (the logic above) exit with a positive result
    process.exit(1);
  }

  // Exit the process after we're finished
  process.exit(result.status);
};
