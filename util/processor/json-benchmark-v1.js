var fs = require('fs-extra');
var path = require('path');
var objectPath = require('../object-path');
var getGitHashSync = require('../get-git-hash-sync');

/**
 * @typedef {Object} JSONBenchmarkObject
 * @prop {string} name
 * @prop {string} version
 * @prop {string} url
 * @prop {string} browser
 * @prop {string} os
 * @prop {number} hz
 * @prop {string} error
 * @prop {Benchmark.Stats} stats
 */

/**
 * Returns the version string of the current working directory.
 * It is the git short hash of the last commit that changed index.js
 * If there are uncommitted changes to index, this method will throw.
 * @returns {string}
 */
function getMyLatestVersion() {
	// should be same as stableStringify always
	var path = require.resolve('../../index');
	return getGitHashSync(path);
}

/**
 * @param {Object<Promise>} fileCache
 * @param {string} filePath
 * @param {string[]} objectPathSegments
 * @param {JSONBenchmarkObject} obj
 * @returns {Promise}
 */
function writeObjectToFileCache(fileCache, filePath, objectPathSegments, obj) {
	var promise;

	if (fileCache.hasOwnProperty(filePath)) {
		promise = fileCache[filePath];
	} else {
		promise = fileCache[filePath] = fs.ensureFile(filePath)
			.then(function() {
				return fs.readFile(filePath, 'utf-8');
			})
			.then(function(str) {
				if (str) {
					return JSON.parse(str);
				} else {
					return {};
				}
			})
			.catch(function(err) {
				console.error('Could not read object from ' + filePath + ':', err);
				throw err;
			});
	}

	return promise
		.then(function(root) {
			// Set the object. Just overwrite if it exists: assume latest data is best.
			objectPath.setObject(root, objectPathSegments, obj);
		});
}

function flushFile(fileCache, filePath) {
	return fileCache[filePath]
		.then(function(root) {
			return fs.writeFile(filePath, JSON.stringify(root, null, 4));
		})
		.catch(function(err) {
			console.error('Could not write object to file ' + filePath + ':', err);
		});
}

/**
 * JSONBenchmarkV1Processor
 * @implements SummaryProcessor
 */
function JSONBenchmarkV1Processor(rootDir) {
	this._rootDir = rootDir;
	this._fileCache = {};
}

JSONBenchmarkV1Processor.prototype.process = function process(browser, os, text) {
	var rootDir = this._rootDir;
	var data = JSON.parse(text);
	var pkg;
	var version;
	if (data.name == 'index') {
		pkg = require(path.join(this._rootDir, 'package.json'));
		version = getMyLatestVersion();
    } else if (data.name == 'native') {
        pkg = { name: 'JSON.stringify', url: 'n/a' }
        version = 'native';
	} else {
		pkg = require(data.name + '/package.json');
		version = pkg.version;
	}
	var obj = {
		name: pkg.name,
		version: version,
		url: pkg.url,
		browser: browser,
		os: os,
		hz: data.hz,
		error: data.error,
		stats: data.stats
	};
	var filename = obj.name + '-' + obj.version + '.json';
	var filepath = path.join(rootDir, 'result', filename);
	return writeObjectToFileCache(this._fileCache, filepath, [browser, os], obj);
};

JSONBenchmarkV1Processor.prototype.finish = function finish() {
	var fileCache = this._fileCache;
	var filePath;
	var promises = [];
	for (filePath in fileCache) {
		promises.push(flushFile(fileCache, filePath));
		// it should no longer be found on iteration
		delete fileCache[filePath];
	}
	return Promise.all(promises).then(function() { console.log('flushed')});
};

module.exports = JSONBenchmarkV1Processor;
