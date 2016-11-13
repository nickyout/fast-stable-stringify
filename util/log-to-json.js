var regHeader = /<(.+?) on (.+?)> console/;
var regBench = /Finished benchmarking: (.+?) x (.+?) ops\/sec ±(.+?)% \((\d+) runs sampled\) \(cumulative string length: (\d+)\)/;

/**
 * Something ike '3,456' becomes 3.456
 * @param {string} opsPerSec
 * @returns {number}
 */
function toNumber(opsPerSec) {
	return parseFloat(opsPerSec.replace(',', '.'));
}

/**
 * Returns the element within obj under the path given by pathSegments.
 * If any segment does not yet exist, an object is created on that place.
 * @param {Object} obj
 * @param {string[]} pathSegments
 * @returns {Object}
 */
function getPath(obj, pathSegments) {
	var target = obj;
	var pathSeg;
	var i;
	for (i = 0; i < pathSegments.length; i++) {
		pathSeg = pathSegments[i];
		if (!target.hasOwnProperty(pathSeg)) {
			target[pathSeg] = {};
		}
		target = target[pathSeg];
	}
	return target;
}

/**
 * @typedef {Object} BrowserTestResult
 * @prop {Object} [browser]
 * @prop {Object} [nickyout/fast-stable-stringify]
 * @prop {Object} [substack/json-stable-stringify]
 */

/**
 * Reads the log. Extracts the info it wants.
 * @param {Object} collection
 * @param {string[]} path
 * @param {string} logText - contents of a text file
 * @returns {Object}
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
				data = getPath(collection, path.concat(repo, browser, os));
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