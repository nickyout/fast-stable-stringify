var regHeader = /<(.+?) on (.+?)> console/;
var regBench = /Finished benchmarking: (.+?) x (.+?) ops\/sec ±(.+?)% \((\d+) runs sampled\) \(cumulative string length: (\d+)\)/;
var getPath = require('./get-path');

/**
 * Something ike '3,456' becomes 3.456
 * @param {string} opsPerSec
 * @returns {number}
 */
function toNumber(opsPerSec) {
	return parseFloat(opsPerSec.replace(',', ''));
}

/**
 * @typedef {Object} TestResult
 * @prop {LibTestResult} [nickyout/fast-stable-stringify]
 * @prop {LibTestResult} [substack/json-stable-stringify]
 */

/**
 * @typedef {Object} LibTestResult
 * @prop {LibBrowserTestResult} [any]
 */

/**
 * @typedef {Object} LibBrowserTestResult
 * @prop {LibBrowserOSTestResult} [any]
 */

/**
 * @typedef {Object} LibBrowserOSTestResult
 * @prop {number} opsPerSec
 * @prop {number} percentage - in 100
 * @prop {number} numSamples
 * @prop {number} cumStrLength
 */

/**
 * Reads the log. Extracts the info it wants.
 * @param {Object} collection
 * @param {string[]} path
 * @param {string} logText - contents of a text file
 * @returns {TestResult}
 */
function logToJSON(collection, path, logText) {
	var textLines = logText.split('\n');
	var textLine;
	var i;
	var match;

	var repo;
	var browser;
	var os;
	var data;

	collection || (collection = {});

	for (i = 0; i < textLines.length; i++) {
		textLine = textLines[i];
		// is header?
		match = textLine.match(regHeader);
		if (match) {
			browser = match[1];
			os = match[2];
		} else if (browser && os) {
			match = textLine.match(regBench);
			if (match) {
				repo = match[1];
				data = getPath(collection, path.concat(repo, browser, os), true);
				data.opsPerSec = toNumber(match[2]);
				data.percentage = +match[3];
				data.numSamples = +match[4];
				data.cumStrLength = +match[5];
			}
		}
	}
	return collection;
}

module.exports = logToJSON;
