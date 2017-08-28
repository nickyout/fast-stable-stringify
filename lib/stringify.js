var util = require('./util');
var escape = require('./escape');
var isArray = util.isArray;
var objKeys = util.objKeys;
var strReg = escape.regSearch;
var strReplace = escape.regReplace;
var strEscape = escape.execute;

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
						str += '"' + key.replace(strReg, strReplace) + '":' + stringifyReg(val[key]);
					}
					i++;
				}
				return '{' + str + '}';
			}
		case "undefined":
			return null;
		case "string":
			return '"' + val.replace(strReg, strReplace) + '"';
		default:
			return val;
	}
}

function stringifyExec(val) {
	var i, max, str, keys, key;
	switch (typeof val) {
		case "object":
			if (val === null) {
				return null;
			} else if (isArray(val)) {
				str = '[';
				max = val.length - 1;
				for (i = 0; i < max; i++) {
					str += stringifyExec(val[i]) + ',';
				}
				if (max > -1) {
					str += stringifyExec(val[i]);
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
						str += '"' + strEscape(key) + '":' + stringifyExec(val[key]);
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

module.exports.execImpl = function (val) {
	if (val !== undefined) {
		return ''+ stringifyExec(val);
	}
};

module.exports.regImpl = function (val) {
	if (val !== undefined) {
		return ''+ stringifyReg(val);
	}
};