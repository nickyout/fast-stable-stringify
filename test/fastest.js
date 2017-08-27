// Benchmark example 'borrowed' from EventEmitter3 repo
var Benchmark = require('benchmark');
var assert = require("assert");

var currentStringify = require('../index');
var fastStableStringify = require('fast-stable-stringify');
var substackStringify = require('json-stable-stringify');
var fasterStableStringify = require('faster-stable-stringify');
var data = require("../fixtures/index").input;
var dataLength = JSON.stringify(data).length;

// Paranoia, hopefully v8 will not perform some function loops away
suite("Benchmark", function() {
	var dataSets;
	var fastestStable;

	function createTestCase(stringifyMethod) {
		return function() {
			var stringificationResult = stringifyMethod(data);
			if (stringificationResult.length !== dataLength) {
				throw new Error("Unexpected stringification result length");
			}
		}
	}

	setup(function(done) {
		dataSets = [];
		this.timeout(40000);
		(new Benchmark
			.Suite('fastest', {
				onCycle: function cycle(e) {
					var bench = e.target;
					console.log('Finished benchmarking: '+ bench, bench.error);
					dataSets.push({
						name: bench.name,
						error: bench.error ? bench.error.message : '',
						hz: bench.hz,
						stats: bench.stats
					});
				},
				onComplete: function completed() {
					fastestStable = this.filter(function(bench) {
						// native is no competition, but this is for comparison purposes
						return bench.name !== 'native' && !bench.error;
					}).filter('fastest').pluck('name');
					done();
				}
			}))
			.add('index', createTestCase(currentStringify))
			.add('json-stable-stringify', createTestCase(substackStringify))
			.add('faster-stable-stringify', createTestCase(fasterStableStringify))
			.add('fast-stable-stringify', createTestCase(fastStableStringify))
			.add('native', createTestCase(JSON.stringify))
			.run({ async: true });
	});
	test("fastest stable", function() {
		dataSets.forEach(function(dataSet) {
			console.log('type:json-benchmark-v1;' + JSON.stringify(dataSet))
		});
		// should at least not be significantly slower
		console.log('fastest stable: ' + fastestStable);
		assert.ok(fastestStable.indexOf('index') !== -1);
	})
});
