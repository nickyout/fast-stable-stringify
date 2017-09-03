var fs = require('fs-extra');
var objectPath = require('./object-path');

function flushFile(fileCache, filePath) {
	var promise = fileCache[filePath];
	// it should no longer be found on iteration
	delete fileCache[filePath];
	return promise
		.then(function(root) {
			process.stderr.write('\nwriting to file ' + filePath);
			return fs.writeFile(filePath, JSON.stringify(root, null, 4));
		})
		.catch(function(err) {
			console.error('Could not write object to file ' + filePath + ':', err);
		});
}

function FileCache(baseObject) {
	this._fileCache = {};
	this._baseObject = baseObject || {};
}

FileCache.prototype.write = function(filePath, objectPathSegments, obj) {
	var baseObject = this._baseObject;
	var fileCache = this._fileCache;
	var promise;

	if (fileCache.hasOwnProperty(filePath)) {
		promise = fileCache[filePath];
	} else {
		promise = fileCache[filePath] = fs.ensureFile(filePath)
			.then(function () {
				return fs.readFile(filePath, 'utf-8');
			})
			.then(function (str) {
				if (str) {
					return JSON.parse(str);
				} else {
					// clone
					return JSON.parse(JSON.stringify(baseObject));
				}
			})
			.catch(function (err) {
				console.error('Could not read object from ' + filePath + ':', err);
				throw err;
			});
	}

	return promise
		.then(function(root) {
			// Set the object. Just overwrite if it exists: assume latest data is best.
			objectPath.setObject(root, objectPathSegments, obj);
		});
};

FileCache.prototype.flush = function() {
	var fileCache = this._fileCache;
	var promises = Object.keys(this._fileCache)
		.map(function(filePath) {
			return flushFile(fileCache, filePath);
		});
	return Promise.all(promises);
};



module.exports = FileCache;
