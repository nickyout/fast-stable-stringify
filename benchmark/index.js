// Benchmark example 'borrowed' from EventEmitter3 repo
var Benchmark = require('benchmark'),
	logger = new(require('devnull'))({ timestamp: false, namespacing: 0 });

var myStringify = require('../'),
	substackStringify = require('json-stable-stringify'),
	data = [
		require('../fixtures/final-boss.json'),
		require('../fixtures/final-boss-undefined')
	];

var result;

console.log('Benchmark');
(new Benchmark.Suite())
	.add('nickyout/fast-stable-stringify', function() {
		result = myStringify(data);
	})
	.add('substack/json-stable-stringify', function() {
		result = substackStringify(data);
	})
	.on('cycle', function cycle(e) {
		var details = e.target;
		logger.log('Finished benchmarking: "%s"', details.name);
		logger.metric('Count (%d), Cycles (%d), Elapsed (%d), Hz (%d)'
			, details.count
			, details.cycles
			, details.times.elapsed
			, details.hz
		);
	})
	.on('complete', function completed() {
		logger.info('Benchmark: "%s" is the fastest.'
			, this.filter('fastest').pluck('name')
		);
	})
	.run();
