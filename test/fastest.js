// Benchmark example 'borrowed' from EventEmitter3 repo
var Benchmark = require('benchmark'),
	assert = require("assert");

var myStringify = require('../index'),
	substackStringify = require('json-stable-stringify'),
	data = require("../fixtures/index").input;

// Paranoia, hopefully v8 will not perform some function loops away
var result;

suite("Benchmark", function() {
	this.timeout(30000);
	test("fastest", function(done) {
		(new Benchmark.Suite())
			.add('nickyout/fast-stable-stringify', function() {
				result = myStringify(data);
			})
			.add('substack/json-stable-stringify', function() {
				result = substackStringify(data);
			})
			.on('cycle', function cycle(e) {
				console.log('Finished benchmarking: '+ e.target);
			})
			.on('complete', function completed() {
				var fastest = this.filter('fastest').pluck('name');
				assert.equal(fastest, 'nickyout/fast-stable-stringify');
				done();
			})
			.run();
	});
});