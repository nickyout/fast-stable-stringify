var cp = require('child_process');

module.exports = function getGitHashSync(filePath) {
	var commandResult;
	try {
		cp.execSync('git diff-index --quiet HEAD -- ' + filePath, { encoding: 'utf-8' });
	} catch (err) {
		throw new Error('Cannot resolve git hash of file ' + filePath + ': There are uncommitted changes to file ' + filePath);
	}
	commandResult = cp.execSync('git log -n1 --pretty=format:%h -- ' + filePath, { encoding: 'utf-8' });
	if (!commandResult) {
		throw new Error("Could not get hash: file " + filePath + " does not exist");
	}
	return commandResult;
};
