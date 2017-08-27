var readline = require('readline');
var input = readline.createInterface({ input: process.stdin, terminal: false });
var summaryFormat = /^browser:([\w\s\.]+);os:([\w\s\.]+);(?:type:(.*);)?(.*)/;
var path = require('path');

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
		var result = line.match(summaryFormat);
		var type;

		if (result) {
			type = result[3];
			if (processors.hasOwnProperty(type)) {
				if (!activeProcessors.hasOwnProperty(type)) {
					activeProcessors[type] = new processors[type](rootDir);
				}
				activeProcessors[type].process(result[1], result[2], result[4]);
			} else {
				console.error('Omitting line:', line);
			}
		}
	});

	inputStream.on('close', function() {
		for (var name in activeProcessors) {
			activeProcessors[name].finish();
			delete activeProcessors[name];
		}
	})
}

processSummary(input, {
	// I'm fairly certain I will come up with another fancy format in a year.
	// I suspect this is pluggable enough for that moment
	'json-benchmark-v1': require('./processor/json-benchmark-v1')
});