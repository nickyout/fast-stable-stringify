var path = require('path');
var FileCache = require('../util/file-cache');
var getLibInfo = require('../util/get-lib-info');

function dateToPrettyString(date) {
	return [
		date.getFullYear(),
		'-',
		date.getMonth() + 1,
		'-',
		date.getDate(),
		'_',
		date.getHours(),
		'-',
		date.getMinutes()
	].map(function(val) {
		return (0 <= val && val < 100) ? ("0" + val).slice(-2) : val;
	}).join('');
}

/**
 * @typedef {Object} JSONBenchmarkObjectV2
 * @prop {string} name
 * @prop {string} version
 * @prop {string} url
 * @prop {string} browser
 * @prop {string} os
 * @prop {Object} result
 * @prop {number} result.hz
 * @prop {string} result.error
 * @prop {boolean} result.fastest
 * @prop {number} result.rme
 * @prop {number} result.rhz
 */

/**
 * BenchmarkRelativeProcessor
 * @implements SummaryProcessor
 */
function RelativeTextToFileProcessor(type, dest) {
	this._dest = dest;
	this._fileCache = new FileCache({ _metaData: { type: type }});
}

RelativeTextToFileProcessor.prototype.process = function process(browser, os, text) {
	var dest = this._dest;
	var data = JSON.parse(text);
	var info = getLibInfo(data.name);
	var obj = {
		name: info.name,
		version: info.version,
		url: info.url,
		browser: browser,
		os: os,
		result: {
			hz: data.hz,
			error: data.error,
			fastest: data.fastest,
			rme: data.rme,
			rhz: data.rhz
		}
	};
	var libFullName = obj.name + '@' + obj.version;
	var filePath = path.resolve(dest, browser + '.json');
	return this._fileCache.write(filePath, [os, libFullName], obj);
};

RelativeTextToFileProcessor.prototype.finish = function finish() {
	return this._fileCache.flush();
};

module.exports = RelativeTextToFileProcessor;

