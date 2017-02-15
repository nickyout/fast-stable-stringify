var jsonToTable = require('../util/json-to-table');
var testLog = require('../fixtures/log-result.json');
var fs = require('fs');
var tableResult = fs.readFileSync('fixtures/table.txt', 'utf-8');
var assert = require('assert');

suite("json-to-table", function() {
	test("conversion to table", function() {
        var tableString = jsonToTable(testLog, ["nickyout/fast-stable-stringify"], ["substack/json-stable-stringify"]);
        assert.equal(tableString, tableResult);
	});
});
