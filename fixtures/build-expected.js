var fs = require('fs'),
    stringify = require('json-stable-stringify'),
    fixtures = require('./'),
	eachRecursive = require('../util/eachRecursive');

var expected = {};

eachRecursive(fixtures.input, function(val, path) {
	expected[path] = stringify(val);
});

// Write json
fs.writeFileSync(__dirname + '/expected.json', stringify(expected));
