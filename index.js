var toString = {}.toString;
var isArray = Array.isArray || function(obj){
		return toString.call(obj) === "[object Array]";
	};
var objKeys = Object.keys || function(obj) {
		var keys = [];
		for (var name in obj) {
			if (obj[name] !== undefined) {
				keys.push(name);
			}
		}
		return keys;
	};

function strEscape(str){
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

function stringifyReg(val) {
	var i, max, str, keys, key;
	switch (typeof val) {
		case "object":
			if (val === null) {
				return null;
			} else if (isArray(val)) {
				str = '[';
				max = val.length - 1;
				for (i = 0; i < max; i++) {
					str += stringifyReg(val[i]) + ',';
				}
				if (max > -1) {
					str += stringifyReg(val[i]);
				}
				return str + ']';
			} else {
				// only object is left
				keys = objKeys(val).sort();
				max = keys.length;
				str = "";
				i = 0;
				while (i < max) {
					key = keys[i];
					if (val[key] !== undefined) {
						if (str) {
							str += ',';
						}
						str += '"' + strEscape(key) + '":' + stringifyReg(val[key]);
					}
					i++;
				}
				return '{' + str + '}';
			}
		case "undefined":
			return null;
		case "string":
			return '"' + strEscape(val) + '"';
		default:
			return val;
	}
}

module.exports = function(val) {
	if (val !== undefined) {
		return ''+ stringifyReg(val);
	}
};