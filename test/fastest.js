// Benchmark example 'borrowed' from EventEmitter3 repo
var Benchmark = require('benchmark');
var assert = require("assert");
var EnumBenchmarkType = require('../benchmark-log/enum');
var relativeBenchToLog = require('../benchmark-log/relative/bench-to-text');
var statsBenchToLog = require('../benchmark-log/stats/bench-to-text');

var stringifiers = {
	'native': JSON.stringify,
	'index': require('../index'),
	'json-stable-stringify': require('json-stable-stringify'),
	'faster-stable-stringify': require('faster-stable-stringify'),
	'fast-stable-stringify': require('fast-stable-stringify')
};

var loggers = {};
loggers[EnumBenchmarkType.RELATIVE] = relativeBenchToLog;
loggers[EnumBenchmarkType.STATS] = statsBenchToLog;

var data = require("../fixtures/index").input;
var dataLength = JSON.stringify(data).length;

// swap to change logger
var selectedBenchmarkType = EnumBenchmarkType.RELATIVE;

// Paranoia, hopefully v8 will not perform some function loops away
suite("Benchmark", function() {
	var benchmarkSuite;

	function createTestCase(stringifyMethod) {
		return {
			minSamples: 90,
			fn: function () {
				var stringificationResult = stringifyMethod(data);
				if (stringificationResult.length !== dataLength) {
					throw new Error("Unexpected stringification result length");
				}
			}
		}
	}

	setup(function(done) {
		var name;
		benchmarkSuite = new Benchmark.Suite('fastest', {
			onCycle: function cycle(e) {
				console.log('Finished benchmarking: '+ e.target);
			},
			onComplete: function completed() {
				done();
			}
		});
		for (name in stringifiers) {
			benchmarkSuite.add(name, createTestCase(stringifiers[name]));
		}
		benchmarkSuite.run({ async: true });
		this.timeout(70000);
	});
	test("fastest stable", function() {

		var benchesFastest = benchmarkSuite
			.filter(function(bench) { return bench.name != 'native'; })
			.filter('fastest');
		var benchesFastestNames = benchesFastest.pluck('name');
		var benchFastest = benchesFastest[0];

		benchmarkSuite
			.map(function(bench) {
				return loggers[selectedBenchmarkType](bench, benchFastest);
			})
			.forEach(function(text) {
				console.log('type:'+selectedBenchmarkType+';' + text);
			});

		console.log('fastest stable: ' + benchesFastestNames);

		// index should at least not be significantly slower
		assert.ok(benchesFastestNames.indexOf('index') !== -1);
	})
});
