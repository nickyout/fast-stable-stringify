var path = require('path');
var FileCache = require('../util/file-cache');
var getLibInfo = require('../util/get-lib-info');

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
 * JSONBenchmarkV1Processor
 * @implements SummaryProcessor
 */
function JSONBenchmarkV1Processor(rootDir) {
	this._rootDir = rootDir;
	this._fileCache = new FileCache();
}

JSONBenchmarkV1Processor.prototype.process = function process(browser, os, text) {
	var rootDir = this._rootDir;
	var data = JSON.parse(text);
	var info = getLibInfo(rootDir, data.name);
	var obj = {
		name: info.name,
		version: info.version,
		url: info.url,
		browser: browser,
		os: os,
		hz: data.hz,
		error: data.error,
		stats: data.stats
	};
	var filename = obj.name + '-' + obj.version + '.json';
	var filepath = path.join(rootDir, 'result', filename);
	return this._fileCache.write(filepath, [browser, os], obj);
};

JSONBenchmarkV1Processor.prototype.finish = function finish() {
	this._fileCache.flush();
};

module.exports = JSONBenchmarkV1Processor;
