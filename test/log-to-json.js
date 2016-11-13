var fs = require('fs');
var logToJSON = require('../util/log-to-json');
var assert = require('assert');
var testLog = fs.readFileSync('fixtures/log.txt', 'utf-8');
var testLogResult = require('../fixtures/log-result.json');

suite("log-to-json", function() {
	test("converts log to json", function() {
		var collection = {};
		logToJSON(collection, [], testLog);
		assert.deepEqual(collection, testLogResult);
	});
	test("nests results with additional path", function() {
		var collection = {};
		logToJSON(collection, ['abc'], testLog);
		assert.deepEqual(collection, { 'abc': testLogResult });
	});
	test("maintains existing data", function() {
		var collection = {'def': true };
		logToJSON(collection, ['abc'], testLog);
		assert.deepEqual(collection, { 'abc': testLogResult, 'def': true });
	});
});