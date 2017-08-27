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
	var dataSets;
	setup(function(done) {
		dataSets = [];
		this.timeout(30000);
		(new Benchmark
			.Suite('fastest', {
				onCycle: function cycle(e) {
					var bench = e.target;
					console.log('Finished benchmarking: '+ e.target + ' (cumulative string length: ' + result + ")");
					dataSets.push({ name: bench.name, hz: bench.hz, stats: bench.stats });
					result = 0;
				},
				onComplete: function completed() {
					fastest = this.filter('fastest').pluck('name')[0];
					done();
				}
			}))
			.add('index', function() {
				result += myStringify(data).length;
			})
			.add('json-stable-stringify', function() {
				result += substackStringify(data).length;
			})
			.run({ async: true });
	});
	test("fastest", function() {
		dataSets.forEach(function(dataSet) {
			console.log('type:json-benchmark-v1:' + JSON.stringify(dataSet))
		});
		assert.equal(fastest, 'nickyout/fast-stable-stringify');
	})
});
