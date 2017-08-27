var readline = require('readline');
var fs = require('fs');
var input = readline.createInterface({ input: process.stdin, terminal: false });

var summaryFormat = /^browser:([\w\s\.]+);os:([\w\s\.]+);(?:type:(.*);)?(.*)/;

var processors = {
	'json-benchmark-v1': function(browser, os, text) {
		var data = JSON.parse(text);
		var name = data.name;
		var obj = {
			browser: browser,
			os: os,
			data: data
		};
		JSON.stringify(obj);
	}
};

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
				processors[type](result[1], result[2], result[4]);
			} else {
				console.error(line);
			}
		}
	});
}

processSummary(input, processors);