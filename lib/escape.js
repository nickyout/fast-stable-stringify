/**
 * JSON string escape solutions. Faster in different browsers.
 */
module.exports = {

	/**
	 * The string.replace(reg, replace) approach, reg part
	 */
	regSearch: /[\u0000-\u001f"\\]/g,

	/**
	 * The string.replace(reg, replace) approach, replace part
	 */
	regReplace: function(str) {
		var code = str.charCodeAt(0);
		switch (code) {
			case 34: return '\\"';
			case 92: return '\\\\';
			case 12: return "\\f";
			case 10: return "\\n";
			case 13: return "\\r";
			case 9: return "\\t";
			case 8: return "\\b";
			default:
				if (code > 15) {
					return "\\u00" + code.toString(16);
				} else {
					return "\\u000" + code.toString(16);
				}
		}
	},

	/**
	 * The function approach
	 * @param {string} str
	 * @returns {string}
	 */
	execute: function stringEscape(str){
		var length = str.length,
			buffer = '',
			code = 0,
			i = 0;

		for (; i < length; i++) {
			code = str.charCodeAt(i);

			if (code === 34) buffer += '\\"';
			else if (code === 92) buffer += '\\\\';
			else if (code > 31) buffer += String.fromCharCode(code);
			else if (code > 15) buffer += "\\u00" + code.toString(16);
			else if (code === 12) buffer += "\\f";
			else if (code === 10) buffer += "\\n";
			else if (code === 13) buffer += "\\r";
			else if (code === 9) buffer += "\\t";
			else if (code === 8) buffer += "\\b";
			else buffer += "\\u000" + code.toString(16);
		}

		return buffer;
	}
};