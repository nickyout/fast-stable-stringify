module.exports = function stringEscape(str){
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
};
