var logToJSON = require('../util/log-to-json');
var getGitHash = require('../util/get-git-hash');
var fs = require('fs');
var path = require('path');

function getGitCheckout(logText) {
    var match = logText.match(/git checkout -qf (\S+)/);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

function writeJSON(pathToLogFile, jsonDir, fileName, callback) {
    var logText;
    var jsonDestPath;
    var collection;
    try {
        logText = fs.readFileSync(pathToLogFile, 'utf-8');
        if (!fileName) {
            // extract from log here
            fileName = getGitCheckout(logText);
            if (!fileName) {
                // throw
                throw new Error("Could not determine git hash for filename");
            }
        }
        jsonDestPath = path.resolve(jsonDir, fileName + '.json');

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
}

module.exports = function(pathToLogFile, jsonDir, fileName, callback) {
    if (typeof fileName == 'function') {
        // extract gitHash as fileName from logFile
        callback = fileName;
        fileName = null;
    }
    writeJSON(pathToLogFile, jsonDir, fileName, callback);
};
