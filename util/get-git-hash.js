var cp = require('child_process');

module.exports = function getGitHash(ref, callback) {
	var childProcess;
	var result;
	ref || (ref = 'HEAD');
	childProcess = cp.exec('git rev-parse --sq ' + ref);
	childProcess.stdout.on('data', function(data) {
		result = data.substring(1, data.length - 2);
	});
	childProcess.on('close', function(exitCode) {
		if (exitCode === 0) {
			callback(null, result);
		} else {
			callback(new Error('Expected exit code 0, got: ' + exitCode));
		}
	});
};
