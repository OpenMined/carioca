const execa = require('execa');
const { error } = require('./log')

module.exports = async (command, args) => {
	try {
    return await execa(command, args, { stdio: 'inherit' });
	} catch (err) {
		error(`Error running command ${command}`, err);
	}
}
