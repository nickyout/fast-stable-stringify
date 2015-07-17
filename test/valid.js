var myStringify = require('../index'),
	assert = require('assert'),
	eachRecursive = require('../util/eachRecursive');

var fixtures = require('../fixtures'),
	input = fixtures.input,
	expected = fixtures.expected,
	numComparisons = 0;

suite("Unit test", function( ){
	test("Recursively equal to expected", function() {
		eachRecursive(input, function (val, path) {
			var mine = myStringify(val),
				expectedVal = expected[path];
			if (mine !== expectedVal) {
				console.log("[Not equal] path:", path, "value:", val, "mine:", mine);
			}
			assert.equal(mine, expectedVal);
			numComparisons++;
		});
		//console.log(numComparisons + " comparisons made");
	});
	test("Expected number of comparisons run (595)", function() {
		assert.equal(numComparisons, 595);
	})
});
