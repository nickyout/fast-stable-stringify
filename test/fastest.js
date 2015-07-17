// Benchmark example 'borrowed' from EventEmitter3 repo
var Benchmark = require('benchmark'),
	assert = require("assert");

var myStringify = require('../index'),
	substackStringify = require('json-stable-stringify'),
	data = require("../fixtures/index").input;

// Paranoia, hopefully v8 will not perform some function loops away
var result = 0,
	fastest;

suite("Benchmark", function() {
	setup(function(done) {
		this.timeout(30000);
		(new Benchmark.Suite("benchmark", { minSamples: 90 }))
			.add('nickyout/fast-stable-stringify', function() {
				result += myStringify(data).length;
			})
			.add('substack/json-stable-stringify', function() {
				result += substackStringify(data).length;
			})
			.on('cycle', function cycle(e) {
				console.log('Finished benchmarking: '+ e.target + ' (cumulative string length: ' + result + ")");
				result = 0;
			})
			.on('complete', function completed() {
				fastest = this.filter('fastest').pluck('name')[0];
				done();
			})
			.run({ async: true });
	});
	test("fastest", function() {
		assert.equal(fastest, 'nickyout/fast-stable-stringify');
	})
});