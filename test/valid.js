var substackStringify = require('json-stable-stringify'),
	myStringify = require('../index');
	assert = require('assert');

function forEachRecursive(obj, fn) {
	for (var name in obj) {
		if (typeof obj === "object" && obj !== null) {
			forEachRecursive(obj[name], fn);
		}
		fn(obj[name]);
	}
}

var fixtures = [
	require('../fixtures/final-boss.json'),
	require('../fixtures/final-boss-undefined')
];

suite("Unit test", function( ){
	test("equal to substack's", function() {
		var i = 0;
		for (i = 0; i < fixtures.length; i++) {
			forEachRecursive(fixtures, function (val) {
				var mine = myStringify(val),
					substack = substackStringify(val);
				if (mine !== substack) {
					console.log("Not equal:", val);
					console.log("Mine:", myStringify(val));
				}
				assert.equal(mine, substack);
			});
		}
	});
});
