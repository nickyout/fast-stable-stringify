var Transform = require('stream').Transform;
var util = require('util');

var summaryFormat = /^browser:([\w\s\.]+);os:([\w\s\.]+);(?:type:(.*);)?(.*)/;

function SummaryReader(processors, rootDir) {
	Transform.call(this);
	this._rootDir = rootDir;
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
				activeProcessors[type] = new allProcessors[type](type, this._rootDir);
			}
			activeProcessors[type].process(result[1], result[2], result[4]);
		} else {
			process.stderr.write('Omitting line: ' + line + '\n');
		}
	}
	callback();
};

SummaryReader.prototype._flush = function() {
	var activeProcessors = this._activeProcessors;
	var promises = [];
	process.stderr.write('flushing...');
	for (var name in activeProcessors) {
		promises.push(activeProcessors[name].finish());
		delete activeProcessors[name];
	}
	Promise.all(promises).then(function() {
		process.stderr.write('done (' + promises.length + ')\n');
	});
};

module.exports = SummaryReader;


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