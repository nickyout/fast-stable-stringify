var eachRecursive = require('../util/eachRecursive');
var jsonStableStringify = require('json-stable-stringify');
var input = require('../fixtures').input;

/**
 * Assumes json-stable-stringify is always right.
 * @param {function(*):string} stringify
 */
module.exports = function validateLibOutput(stringify) {
	var numComparisons = 0;
	eachRecursive(input, function (val, path) {
		var mine = stringify(val);
		var expectedVal = jsonStableStringify(val);
		assert.equal(mine, expectedVal);
		numComparisons++;
	});
	assert.equal(numComparisons, 606);
};