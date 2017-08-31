var Transform = require('stream').Transform;
var path = require('path');
var util = require('util');

var summaryFormat = /^browser:([\w\s\.]+);os:([\w\s\.]+);(?:type:(.*);)?(.*)/;
var activeProcessors = {};
var rootDir = path.resolve(__dirname, '..');

/**
 * @interface SummaryProcessor
 */

/**
 * Process a single line
 * @function
 * @name SummaryProcessor#process
 * @param {string} browser
 * @param {string} os
 * @param {string} text
 * @returns {Promise}
 */

/**
 * Done processing. Flush and stuff.
 * @function
 * @name SummaryProcessor#finish
 * @returns {Promise}
 */

/**
 *
 * @param {Readable} inputStream
 * @param {Object} processors
 */
function processSummary(inputStream, processors) {
	inputStream.on('line', function(line) {
	});

	inputStream.on('close', function() {
		for (var name in activeProcessors) {
			activeProcessors[name].finish();
			delete activeProcessors[name];
		}
	})
}

function SummaryReader(processors) {
	Transform.call(this);
	this._processors = processors || {};
	this._activeProcessors = {};
}

util.inherits(SummaryReader, Transform);

SummaryReader.prototype._transform = function(chunk, encoding, callback) {
	var line = chunk.toString();
	var result = line.match(summaryFormat);
	var allProcessors = this._processors;
	var activeProcessors = this._activeProcessors;
	var type;
	if (result) {
		type = result[3];
		if (allProcessors.hasOwnProperty(type)) {
			if (!activeProcessors.hasOwnProperty(type)) {
				activeProcessors[type] = new allProcessors[type](rootDir);
			}
			activeProcessors[type].process(result[1], result[2], result[4]);
		} else {
			process.stderr.write('Omitting line: ' + line);
		}
	}
	callback();
};

SummaryReader.prototype._flush = function() {
	var activeProcessors = this._activeProcessors;
	process.stderr.write('flushing...');
	for (var name in activeProcessors) {
		activeProcessors[name].finish();
		delete activeProcessors[name];
	}
};

module.exports = SummaryReader;