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
 * BenchmarkStatsProcessor
 * @implements SummaryProcessor
 */
function StatsTextToFileProcessor(type, rootDir) {
	this._rootDir = rootDir;
	this._fileCache = new FileCache({ _metaData: { type: type }});
}

StatsTextToFileProcessor.prototype.process = function process(browser, os, text) {
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

StatsTextToFileProcessor.prototype.finish = function finish() {
	this._fileCache.flush();
};

module.exports = StatsTextToFileProcessor;
