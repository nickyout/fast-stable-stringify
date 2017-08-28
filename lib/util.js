var toString = {}.toString;

module.exports = {
	isArray: Array.isArray || function(obj){
		return toString.call(obj) === "[object Array]";
	},
	objKeys: Object.keys || function(obj) {
		var keys = [];
		for (var name in obj) {
			if (obj[name] !== undefined) {
				keys.push(name);
			}
		}
		return keys;
	}
};