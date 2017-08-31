var Transform = require('stream').Transform;
var regHeader = /^<(.+?) on (.+?)>/;
var omitChar = "-";
var objMoot = { type: 'comment', value: '' };

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

//module.exports = logToSummary;

module.exports = new Transform({
	transform: function(chunk, encoding, callback) {
		var data = processLine(chunk.toString());
		var currentHeader = this._ch;
		if (data.type == 'header') {
			currentHeader = data.value;
		} else if (data.type == "line" && currentHeader) {
			this.push(currentHeader + data.value);
		}
		this._ch = currentHeader;
		callback();
	}
});
