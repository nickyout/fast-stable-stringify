var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var rootDir = path.resolve(__dirname, '..');
var split = require('split');
var EnumBenchmarkType = require('./../benchmark-type/enum');
var formatTable = require('./format-table');

function readLog() {
	var logToSummary = require('./log-to-summary');
	var SummaryReader = require('./summary-reader');
	var processors = {};
	processors[EnumBenchmarkType.STATS] = require('./../benchmark-type/stats/text-to-file');
	processors[EnumBenchmarkType.RELATIVE] = require('./../benchmark-type/relative/text-to-file');
	var reader = new SummaryReader(processors, rootDir);

	process.stdin
		.pipe(split())
		.pipe(logToSummary)
		.pipe(reader);
}

function compareResults(files) {
	var fs;
	var FileComparer = require('./compare-results');
	var processors = {};
	processors[EnumBenchmarkType.RELATIVE] = require('../benchmark-type/relative/file-compare');
	processors[EnumBenchmarkType.STATS] = require('../benchmark-type/stats/file-compare');
	var comparer = new FileComparer(processors);
	var resultsDir;
	var actualFiles;

	if (files.length) {
		return comparer.compare(files);
	} else {
		fs = require('fs');
		resultsDir = path.resolve(rootDir, 'result');
		return new Promise(function(resolve) {
			fs.readdir(resultsDir, function(err, dirFiles) {
				actualFiles = dirFiles
					.map(function(file) {
						return path.resolve(resultsDir, file);
					});
				resolve(comparer.compare(actualFiles));
			});
		});
	}
}

switch (argv._[0]) {
	case "read":
		readLog();
		break;
	case "table":
		compareResults(argv._.slice(1))
			.then(function(comparisonResult) {
				return formatTable(comparisonResult, { hideColumns: ['JSON.stringify@native'] })
			})
			.then(function(str) {
				console.log(str);
			})
			.catch(function(err) {
				console.error(err);
			});
		break;
	default:
		console.log('Usage: node cli [read|table]');
}