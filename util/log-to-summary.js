var readline = require('readline');

var regHeader = /^<(.+?) on (.+?)> /;
var omitChar = "-";
var objMoot = { type: 'comment', value: '' };

var input = readline.createInterface({ input: process.stdin, terminal: false });

/**
 *
 * @param {Readable} inputStream
 * @param {Writable} outputStream
 */
function logToSummary(inputStream, outputStream) {
	var str = '';
	var currentHeader;

	inputStream.on('line', function(line) {
		var data = processLine(line);
		if (data.type == 'header') {
			currentHeader = data.value;
		} else if (data.type == "line" && currentHeader) {
			outputStream.write(currentHeader + data.value + '\n');
		}
	});
}

/**
 *
 * @param {string} line
 * @return {Object}
 */
function processLine(line) {
	var match;
	if (match = line.match(regHeader)) {
		return {
			type: 'header',
			value: 'browser:' + match[1] + ';os:' + match[2] + ';'
		};
	} else if (!line || line[0] == omitChar) {
		return objMoot;
	} else {
		return {
			type: 'line',
			value: line
		};
	}
}

logToSummary(input, process.stdout);