var toString = {}.toString,
	isArray = Array.isArray || function(obj){
		return toString.call(obj) === "[object Array]";
	},
	objKeys = Object.keys || function(obj) {
			var keys = [];
			for (var name in obj) {
				if (obj.hasOwnProperty(name)) {
					keys.push(name);
				}
			}
			return keys;
		},
	strEscape = strEscape;

/**
 * Simple stable stringify. Object keys sorted. No options, no spaces.
 * @param {*} val
 * @returns {string}
 */
module.exports = function simpleStableStringify(val) {
	if (val !== undefined) {
		return ''+ sss(val);
	}
};

module.exports.stringEscape = strEscape;

function sss(val) {
	var i, max, str, keys, key, pass;
	switch (typeof val) {
		case "object":
			if (val === null) {
				return null;
			} else if (isArray(val)) {
				str = '[';
				max = val.length - 1;
				for (i = 0; i < max; i++) {
					str += sss(val[i]) + ',';
				}
				if (max > -1) {
					str += sss(val[i]);
				}
				return str + ']';
			} else {
				// only object is left
				keys = objKeys(val).sort();
				max = keys.length;
				str = "{";
				key = keys[i = 0];
				pass = max > 0 && val[key] !== undefined;
				while (i < max) {
					if (pass) {
						str += '"' + strEscape(key) + '":' + sss(val[key]);
						key = keys[++i];
						pass = i < max && val[key] !== undefined;
						if (pass) {
							str += ',';
						}
					} else {
						key = keys[++i];
						pass = i < max && val[key] !== undefined;
					}
				}
				return str + '}';
			}
		case "undefined":
			return null;
		case "string":
			return '"' + strEscape(val) + '"';
		default:
			return val;
	}
}

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
