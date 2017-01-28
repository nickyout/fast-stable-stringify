var logToJSON = require('../util/log-to-json');
var getGitHash = require('../util/get-git-hash');
var fs = require('fs');
var path = require('path');

module.exports = function(pathToLogFile, jsonDir, gitRef, callback) {
	getGitHash(gitRef, function(errGitHash, gitHash) {
		var jsonDestPath;
		var collection;
		var logText;
		if (errGitHash) {
			callback(errGitHash);
			return;
		}
		try {
			logText = fs.readFileSync(pathToLogFile, 'utf-8');
			jsonDestPath = path.resolve(jsonDir, gitHash + '.json');

			if (fs.existsSync(jsonDestPath)) {
				collection = JSON.parse(fs.readFileSync(jsonDestPath), 'utf-8');
			} else {
				collection = {};
			}
			collection = logToJSON(collection, [], logText);
			fs.writeFileSync(jsonDestPath, JSON.stringify(collection, null, 2), 'utf-8');
			callback(null, jsonDestPath);
		} catch (errCaught) {
			callback(errCaught);
		}
	});
};